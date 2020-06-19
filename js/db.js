//OFFLINE DATABASE
db.enablePersistence()
.catch(err =>{
    if(err.code == 'failed-precondition'){
        console.log('persistence failed multiple tabs open at once')
    }else if(err.code == 'unimplemented'){
        console.log('browser support not available')
    }
})

db.collection('recipes').onSnapshot((snapshot) =>{
    snapshot.docChanges().forEach(change =>{
        // console.log(change, change.doc.data(), change.doc.id)
        if(change.type === 'added'){
            renderRecipe(change.doc.data(), change.doc.id)
        }
        if(change.type === 'removed'){
            removeRecipe(change.doc.id)
        }
    })
})

const form = document.querySelector('form')
form.addEventListener('submit', evt =>{
    evt.preventDefault()
    const recipes ={
        title: form.title.value,
        ingredients: form.ingredients.value
    }
    db.collection('recipes').add(recipes)
    .catch(err =>{
        console.log(err)
    })
    form.title.value =""
    form.ingredients.value=""
})
const recipeContainer = document.querySelector('.recipes')
recipeContainer.addEventListener('click', evt =>{
  // console.log(evt)
  if(evt.target.tagName === 'I'){
    const id = evt.target.getAttribute('data-id')
    db.collection('recipes').doc(id).delete()
  }
})