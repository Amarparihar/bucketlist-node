const { MongoClient } = require("mongodb");

const router = require("express").Router();

const URL = process.env.dbURL || "mongodb://localhost:27017";
const DB = "quizdatabase";


router.get("/bucketlist/:id" , async(req,res) => {
    try {
        let client = await MongoClient.connect(URL);
        let db = client.db(DB);
        let data = await db.collection('bucketlist').find({ email: req.params.id }).toArray();
        if(data){
            
            res.status(200).json(data);
        }else{
            res.status(404).json({message:"Data not Found"});
        }

        await client.close();
        
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

router.post("/create-bucketlist/:id" , async(req,res) => {

    try {
        let client = await MongoClient.connect(URL);
        let db = client.db(DB);
        let data = await db.collection("users").findOne({ email: req.params.id });
        if(data){
            await db.collection('bucketlist').insertOne({
                bucketList: req.body.list,
                email: req.params.id

            });
        res.status(200).json({message:"BucketList Added"});
        }else {
      res.status(404).json({ message: "Invalid ID" });
    }
        

        await client.close();
        
    } catch (error) {
        console.log(error);
        res.sendStatus(500);

    }

})

router.delete("/delete/:id", async(req , res) => {
    try {
        let client = await MongoClient.connect(URL);
        let db = client.db(DB);
        await db.collection('bucketlist').findOneAndDelete({email: req.params.id});
        res.status(200).json({message:"data deleted"});

        await client.close();
        
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})






module.exports = router;