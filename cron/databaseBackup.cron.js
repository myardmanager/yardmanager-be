const cron = require("node-cron");
const path = require("path");
const { exec } = require("child_process");
const { MongoClient } = require("mongodb");
const fs = require("fs");

exports.feeGenerator = cron.schedule(
  "0 0 0 1 * *",
  async () => {
    console.log("Running a backup task");

    // const backupDir = path.join(
    //   __dirname,
    //   "backups",
    //   `backup-${new Date().toISOString().split("T")[0]}`
    // );
    const uri =
      "mongodb+srv://urtbadev:urtbadev123@cluster0.mxxzuis.mongodb.net/?retryWrites=true&w=majority"; // Replace with your MongoDB URI

    const client = new MongoClient(uri);
    try {
      await client.connect();
      const db = client.db('test');
      const collections = await db.collections();
  
      const backupDir = path.join(__dirname, 'backups', `backup-${new Date().toISOString().split('T')[0]}`);
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }
  
      for (const collection of collections) {
        const data = await collection.find().toArray();
        const filePath = path.join(backupDir, `${collection.collectionName}.json`);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      }
  
      console.log('Backup successful');
    } catch (error) {
      console.error('Error performing backup:', error);
    } finally {
      await client.close();
    }
    },
  {
    scheduled: false,
  }
);
