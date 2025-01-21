import { Router } from "express";

const router = Router()

let carritos = []

let productos = [
    { id: '001', name: 'Hamburguesa' },
    { id: '002', name: 'Papas fritas' },
    { id: '003', name: 'Refresco' },
];


router.get('/', (req,res)=>{

    res.json({carritos})
})

router.post('/',(req, res)=>{

    const nuevoCarrito = {
        id :(carritos.length + 1).toString(),
        products : []
    }

    carritos.push(nuevoCarrito);
    res.json(carritos);
})

router.get('/:id', (req,res)=>{

    const carritoId = req.params.id;

    const carritoEncontrado = carritos.find((e) => e.id === carritoId);

    if(!carritoEncontrado){
        return res.status(404).json({error : 'Carritos no encontrado'});
    }

    res.json({carritoEncontrado});
})




export default router