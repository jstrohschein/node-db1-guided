const express = require('express');
// database access using knex
const db = require('../data/db-config.js');
const router = express.Router();


db.on('query', data => {
  console.log(data.sql)
})

router.get('/', async (req, res) => {
  
  try{
    const sql = await db('posts').toString()
    console.log('sql: ', sql)
    
    const posts = await db('posts')
    res.json(posts)
  } 
  
  catch (error) {
    console.log(error)
    res.status(500).json({ message: 'error with database', error:error })
  }
  

});

router.get('/:id', async (req, res) => {

  const {id} = req.params

  try{

    //const [ post ] = await db('post').where({ id })   
    const post = await db('posts').first().where({ id })

    if (post) {
      res.json(post)
    } 

    else{
      res.status(404).json({ message: 'could not find a user with that id' })
    }
  }

  catch (error) {
    res.status(500).json({ messag: 'failed to get post' })
  }

});

router.post('/', async (req, res) => {

  const postData = req.body

  try{
    const post = await db('posts').insert(postData)
    res.status(201).json(post)
  } catch (error){
    res.status(500).json({ messag: 'database erro', error:error })
  }

});

router.put('/:id', async (req, res) => {

  const {id} = req.params
  const changes = req.body

  try{
    const count = await db('posts').update(changes).where({id})
    if (count){
      res.json({update: count})
    }else{
      res.status(404).json({ message: 'not found' })
    }
  }catch(error){
    res.status(500).json({ message: 'server error', error:error })
  }
});

router.delete('/:id', async (req, res) => {

  const {id} = req.params

  try {
    const count = await db('posts').del().where({id})//the order of these does NOT matter -> could be where({id}).del()

    if (count){
      res.json({ deleted: count })
      
    }
  } catch (error) {

    res.status(404).json({ message: 'error', error:error })
    
  }
});

module.exports = router;