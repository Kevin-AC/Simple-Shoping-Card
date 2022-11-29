// fetch('https://api.escuelajs.co/api/v1/products')//fetch nos busca la api, nos da una promesa
// .then(result=>result.json())//then pedimos que nos resuelva la promesa de los datos y json nos trasnforma esos datos, nos da otra promesa
// .then(datos=>console.log(datos))//cun un segundo then accedemos final mente a los daatos en json y los guardamos en la variable data

let shoppingCartArray=[];
let total=0;
let productContainer=document.querySelector('.shop-items');
let totalElement = document.querySelector('.cart-total-title');

//peticion producto al servidor
let res = await fetch('https://api.escuelajs.co/api/v1/products')
let data = await res.json()

//limitamos la cantidad 
let productsArray = data.slice(1,6)
//console.log(productsArray)

//imprimimos en pantalla
productsArray.forEach(product => {//foreach va a recorrer cada elemento del arreglo
    productContainer.innerHTML +=`
    <div class="shop-item" id="${product.id}">
        <span class="shop-item-title">${product.title}</span>
        <img class="shop-item-image" src="${product.images[0]}">
        <div class="shop-item-details">
            <span class="shop-item-price">$${product.price}</span>
            <button class="btn btn-primary shop-item-button" type="button">ADD TO CART</button>
        </div>
    </div>`
    
});
//escuchamos cuando se hace click un boton 
let addBtns=document.querySelectorAll('.shop-item-button');
addBtns=[...addBtns];//pasar node list a arreglo para tener mas metodos

let cartContainer=document.querySelector('.cart-items');
addBtns.forEach(btn=>{
    btn.addEventListener('click',event=>{
        //agregar al carro de compras

        //buscar el id del producto
        
        let actualID = parseInt(event.target.parentNode.parentNode.id)
        //console.log(actualID);
        //con el ID encontrar el objeto actual
       
        let actualPruduct= productsArray.find(item=>item.id==actualID)
        //verificar cantidad del producto
        if(actualPruduct.quantity=== undefined){
            actualPruduct.quantity=1;//agregamos cantidad
        }
        //preguntar si el producto agregado ya existe
        let existe = false
        shoppingCartArray.forEach(articulo =>{
            if(actualID==articulo.id){
                existe=true
            }
        })
        if(existe){
            actualPruduct.quantity++;

        }else{
            shoppingCartArray.push(actualPruduct)
        }
        
        //console.log(shoppingCartArray)
       

        //agregar el producto al arreglo del carro
        drawItems()
       
        //actualizar valor total
        getTotal()
        //actualizar contador de items
        updateNumberOfItems()//poner un escucha en el cajon de cantidades

        removeItems();//poner escucha en el boton remover

    })
})

function getTotal(){
    let sumTotal;
    let total= shoppingCartArray.reduce((sum,item)=>{
        sumTotal=sum+item.quantity*item.price;
        return sumTotal
    },0);
    totalElement.innerText = `$${total}`
}

function drawItems(){
    cartContainer.innerHTML='';
    shoppingCartArray.forEach(item=>{
        cartContainer.innerHTML+=`
        <div class="cart-row">
            <div class="cart-item cart-column">
                <img class="cart-item-image" src="${item.images[0]}" height="100">
                <span class="cart-item-title">${item.title}</span>
            </div>
            <span class="cart-price cart-column">$${item.price}</span>
            <div class="cart-quantity cart-column">
                <input class="cart-quantity-input" min="1" type="number" value="${item.quantity}">
                <button class="btn btn-danger" type="button">REMOVE</button>
            </div>
        </div>`
    });
    removeItems();
}

function updateNumberOfItems(){
    let inputNumber = document.querySelectorAll('.cart-quantity-input');
    inputNumber=[...inputNumber]
    
    inputNumber.forEach(item=>{
        item.addEventListener('click',event=>{
    
            //conseguir titulo del articulo
            let actualArticleTitle = event.target.parentElement.parentElement.childNodes[1].innerText;

            let actualArticleQuantity = parseInt(event.target.value); //optener el numero de la cantidad
            //console.log(actualArticleQuantity)
            //buscar objeto con el titulo
            let actualArticleObject = shoppingCartArray.find(item=> item.title==actualArticleTitle)
            //console.log(actualArticleObject)

            //actualizar el contador 
            actualArticleObject.quantity=actualArticleQuantity;


            //actualizar el precio total
            getTotal();
        });
    });
}

function removeItems(){
    let removeBtns = document.querySelectorAll('.btn-danger');
    removeBtns= [...removeBtns]//pasar nodelist a arreglo
    removeBtns.forEach(btn=>{
        btn.addEventListener('click',()=>{
            //conseguir titulo del articulo
            let actualArticleTitle = event.target.parentElement.parentElement.childNodes[1].innerText;
            //buscar objeto con el titulo
            let actualArticleObject = shoppingCartArray.find(item=> item.title==actualArticleTitle)
            //remover del arreglo
            shoppingCartArray=shoppingCartArray.filter(item=>item !=actualArticleObject)
            //console.log(shoppingCartArray)
            //actualizar el precio total
           
            drawItems();
            getTotal();
            updateNumberOfItems();

        });
    });
   

}