import exress from 'express';
import bodyParser from 'body-parser';
import {MongoClient} from 'mongodb';
import path from 'path';

const app = exress();
app.use(bodyParser.json());
app.use(exress.static(path.join(__dirname + '/build')));

const withDB = async (operations, res) => {
    try {
        // create connection with mongoDB that runs on localhost in port 27017
        const client = await MongoClient.connect('mongodb://localhost:27017', { useUnifiedTopology: true });
        
        // creating instance of db client  that connected to 'my-blog' data base
        const db = client.db('my-blog');

        await operations(db);

        //closing db connections
        client.close();
    
    } catch (error) {

        res.status(500).json({message: 'Error connecting to db', error});    

    }

}

// return info on article with the given :name
app.get('/api/articles/:name', async (req, res) => {
        withDB(async (db) => {
            // get the name from the requested url
            const articleName = req.params.name;

            // query the db table 'articles' to find article with the matching name 
            const articleInfo = await db.collection('articles').findOne({name: articleName});

            // sending back the article info
            res.status(200).json(articleInfo);
        },res);
});

app.post('/api/articles/:name/upvote', async (req, res) => {
        const articleName = req.params.name;
        withDB(async (db) => {
            // select article by name
            const articleInfo = await db.collection('articles').findOne({name: articleName});
            
            // update db with the new incressed upvote property
            await db.collection('articles').updateOne({name: articleName},{
                    '$set': {
                        upvotes : articleInfo.upvotes + 1,
                    },
                });
            
            // select the updated article
            const updatedArticleInfo = await db.collection('articles').findOne({name: articleName});
            
            // send back the updated article info
            res.status(200).json(updatedArticleInfo);
        }, res);
});

app.post('/api/articles/:name/add-comment', (req, res) => {
    const { username, text } = req.body;
        const articleName = req.params.name;

        withDB(async (db) => {
            // select article by name
            const articleInfo = await db.collection('articles').findOne({name: articleName});

            // update db with the new incressed upvote property
            await db.collection('articles').updateOne({name: articleName},{
                    '$set': {
                        comments : articleInfo.comments.concat({ username, text }),
                    },
                });
            
            // select the updated article
            const updatedArticleInfo = await db.collection('articles').findOne({name: articleName});
            
            // send back the updated article info
            res.status(200).json(updatedArticleInfo);
        }, res);
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/build/index.html'));
})
app.listen(8000, () => console.log('Listening on port 8000'));

// app.post('/api/articles/:name/upvote', (req, res) => {
//     const articleName = req.params.name;
//     articlesInfo[articleName].upvotes += 1;

//   res.status(200).send(`${articleName} now has ${articlesInfo[articleName].upvotes} upvotes!`);
// });


// app.post('/api/articles/:name/add-comment', (req, res) => {
//   const { username, text } = req.body;
//   const articleName = req.params.name;
//   articlesInfo[articleName].comments.push({username,text});

//   res.status(200).send(articlesInfo[articleName]);
// });


// POSTMAN TESTS
// app.get('/hello', (req, res) => res.send('Hello!'));

// app.get('/hello/:name', (req, res) => res.send(`Hello ${req.params.name}`));

// app.post('/hello', (req, res) => res.send(`Hello ${req.body.name}`));
