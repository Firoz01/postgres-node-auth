import express from 'express'
import dotenv from  'dotenv'
import prisma from './prisma.client'

dotenv.config({path : './.env'});


process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! Shutting Down...');
  console.log(err.name, err.message);

  process.exit(1);
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 5000

app.get('/', (req,res)=>{
    res.send("Edvive API 2.0")
})


app.post('/user', async(req,res)=>{
    
    const {email}= req.body;
   
   try{
     const newUser =await prisma.user.create({
        data :{
            email: email
        }
    })
    res.status(200).json(newUser)
   }catch(error){
    res.status(500).json(error)
   }
})

const server = app.listen(PORT, () => {
  console.log(`The server is running at port: ${PORT}`);
});

process.on('unhandledRejection', (err: Error) => {
  console.log('UNHANDLED REJECTION! Shutting Down...');
  console.log(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});
