import { Router } from "express";

const router = Router();

let products = [
        {
            title:'Smart TV 4K UHD Samsung 43',
            description:'El Smart TV Samsung 43" UN43CU7000GCFV tiene una resolución cuatro veces superior a la de una TV Full HD',
            code:'UN43CU7000GCFV',
            price: 629.999,
            status:true,
            stock:25,
            category:'Smart TV',
            thumbnails:'https://images.fravega.com/f500/21022979b6a04ce4886c47c99584fc25.jpg',
            id: '1'
        },
        {
            title:'PlayStation 5 PS5 Slim Standar',
            description:'Experimentá una carga ultrarrápida con un SSD de velocidad ultra alta, una inmersión más profunda con soporte para retroalimentación háptica, gatillos adaptativos y audio 3D y una generación completamente nueva de increíbles juegos de PlayStation®.',
            code:'TA45BU7450GCGV' ,
            price: 999.494,
            status:true,
            stock:50,
            category:'Consolas',
            thumbnails:'https://images.fravega.com/f300/d3eadfc1d7530a96a36138ace42ace1d.jpg.webp',
            id: '2'
        },
        {
            title:'Celular Samsung Galaxy A06',
            description:'El Samsung Galaxy A06 64 GB Negro está equipado con un procesador MediaTek G85 y memoria interna para jugar, transmitir videos y navegar en redes sociales. La cámara principal de 50MP captura imágenes increíbles, mientras que la batería de 5,000mAh te permite estar conectado por más tiempo. Disfrutá de la multitarea con el almacenamiento adicional.',
            code:'LA20KO7294GCBS',
            price:199.999,
            status:true,
            stock:100,
            category:'Celularer',
            thumbnails:'https://images.fravega.com/f300/e445ac5475e2e5507c98454983e667e3.jpg.webp',
            id: '3'
        }
];


router.get('/', (req,res) => {
    res.json(products);
})


router.get('/:id', (req,res)=>{

const productsId = req.params.id;
const productoBuscado = products.find(e => e.id === productsId)

if (!productoBuscado){
    return res.send({status: 'error', error : 'products not found'})
}
res.send({productoBuscado})

})

router.post('/',(req, res)=>{

    let producto = req.body;

    if(!producto.title||!producto.description||!producto.code||!producto.price||
        !producto.status||!producto.stock||!producto.category||!producto.thumbnails||('id' in producto)){

            return res.status(400).send({status: 'error', error: 'Incomplete value or have and id'})

        }

    products.push({...producto, id : (products.length + 1).toString() });
    res.send({status: 'succes', message : 'producto created'});
    
})

router.put('/:id',(req, res)=>{

    const productId = req.params.id;
    const updateProduct = req.body;
    const productIndex = products.findIndex(e => e.id === productId);


    if(productIndex === -1){
        return res.status(404).send({status:'error', message:'Product not found'})
    }

    if ('id' in updateProduct) {
        return res.status(400).json({ error: `id cant't be changed` });
    }

    products[productIndex] = { ...products[productIndex], ...updateProduct}

    res.send({status: 'success' , message : 'Product Updated'})


})

router.delete('/:id',(req, res)=>{

    let productId = req.params.id
    const productIndex = products.findIndex(e => e.id === productId);

    if(productIndex === -1){
        return res.status(404).send({status:'error', message:'Product not found'})
    }

    products.splice(productIndex,1);
    res.send({tatus:'success', message : 'Product deleted'})


})

export default router