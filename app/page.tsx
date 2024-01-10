"use client"
import Image from 'next/image'
import { useCallback, useState } from 'react'


function ProductCard({ productCard, handleCart }: ProductCardProps) {
  return(
    <div className='grid grid-rows-3 grid-flow-col gap-4'>
      <div className='row-span-3'>
        <Image src={productCard.img} alt={productCard.name} width={150} height={150}></Image>
      </div>
      <div className='col-span-2 row-span-2'>
        <div><h2>{productCard.name}</h2></div>
        <div className='col-span-2'>{productCard.price}</div>
        <div className='' onClick={() => handleCart(productCard, true)}>
          <Image src="/assets/icon.jpg" alt="Cart" width={24} height={24}></Image>
        </div>
      </div>
    </div>
  )
}

function ProductCatalog({ products, handleCart }: ProductCatalogProps) {

  const rows: JSX.Element[] = [];

  products.forEach((product) => {
    rows.push(<ProductCard productCard={product} key={product.id} handleCart={handleCart}/>);
  });

  return(
    <section className="grid grid-cols-2 gap-30 p-30">{rows}</section>
  )
}

function CartTable( { productCart, handleCart }: CartTableProps) {
  return(
    <div className='grid grid-rows-1 grid-cols-3'>
      <div className='grid grid-rows-1 grid-cols-3'>
        <div onClick={() => {handleCart(productCart, true)}}>+
        </div> {productCart.quantityInCart} 
        <div onClick={() => {handleCart(productCart, false)}}>-
        </div>
      </div>
      <div>{productCart.name}</div>
      <div>{productCart.price}</div>
    </div>
  )
}

function ShoppingCart( { productsCart, handleCart }: ShoppingCartProps) {

  const rows: JSX.Element[] = [];
  let total: number = 0;

  productsCart.map((item) => {
    rows.push(<CartTable key={item.id} productCart={item} handleCart={handleCart}></CartTable>);
    total += item.quantityInCart * item.price;
  })

  return(
    <div className="bg-blue-400 h-800 flex- flex-col">
      <div className='grid grid-rows-1 grid-cols-3 gap-4'>
        <div>SEU CARRINHO DE COMPRAS</div>
        <button className='bg-slate-300 rounded-lg'>CANCELAR</button>
        <button className='bg-slate-300 rounded-lg'>CONFIRMAR PEDIDO</button>
      </div>
      <div className='flex-grow overflow-y-auto scrollbar-hide max-h-[100px]'>{rows}</div>
      <div className='flex p-2 justify-between'>
        <div>
          <Image src="/assets/gift.png" alt="gift" width={25} height={25}></Image>
        </div>
        <div>SubTotal: R$ {total}</div>
      </div>
    </div>
  )
}

export default function Home() {

  const [cart, setCart] = useState<CartData[]>([]);

  const handleCart = useCallback((product: ProductData, add: boolean = true) => {
    setCart((currentCart) => {
      const cartIndex = currentCart.findIndex(item => item.id === product.id);
      
      if (add) {
        if (cartIndex === -1) {
          // Produto não está no carrinho, adiciona com quantidade 1
          return [...currentCart, { ...product, quantityInCart: 1 }];
        } else {
          // Produto já está no carrinho, incrementa a quantidade
          const updatedCart = [...currentCart];
          updatedCart[cartIndex] = {
            ...updatedCart[cartIndex],
            quantityInCart: updatedCart[cartIndex].quantityInCart + 1,
          };
          return updatedCart;
        }
      } else {
        if (cartIndex === -1) {
          // Produto não está no carrinho, não faz nada
          return currentCart;
        } else if (currentCart[cartIndex].quantityInCart > 1) {
          // Reduz a quantidade do produto no carrinho
          const updatedCart = [...currentCart];
          updatedCart[cartIndex] = {
            ...updatedCart[cartIndex],
            quantityInCart: updatedCart[cartIndex].quantityInCart - 1,
          };
          return updatedCart;
        } else {
          // Remove o produto do carrinho
          return currentCart.filter(item => item.id !== product.id);
        }
      }
    });
  }, []);
  

  return (
    <div className='relative'>
      <div className="sticky top-0 left-500 bg-white grid justify-center">
        <Image src="/assets/logo.png" alt="logo" width={50} height={50}></Image>
      </div>
      <div className=''>
        <ProductCatalog products={PRODUCTS} handleCart={handleCart}></ProductCatalog>
      </div>
      <div className="sticky bottom-0">
        <ShoppingCart productsCart={cart} handleCart={handleCart}></ShoppingCart>
      </div>
    </div>
  )
}

interface CartTableProps{
  productCart: CartData;
  handleCart: (product: ProductData, add: boolean) => void;
}

interface ShoppingCartProps {
  productsCart: CartData[];
  handleCart: (product: ProductData, add: boolean) => void;
}

interface CartData extends ProductData {
  quantityInCart: number;
}

interface ProductCardProps {
  productCard: ProductData;
  handleCart: (product: ProductData, add: boolean) => void;
}

interface ProductCatalogProps {
  products: ProductData[];
  handleCart: (product: ProductData, add: boolean) => void;
}

interface ProductData {
  id: number,
  name: string,
  price: number,
  img: string,
  stock: number,
  quantityInCart?: number;
}

const PRODUCTS: ProductData[] = [
  {id: 1, name: "Barra de Cereal Avelã com chocolate", price: 6.00, img: "/assets/nutry-avela-com-chocolate.jpg", stock: 10},
  {id: 2, name: "Barra de Cereal Bolo de chocolate", price: 6.00, img: "/assets/nutry-bolo-de-chocolate.jpg",stock: 10},
  {id: 3, name: "Barra de Cereal Caju com chocolate", price: 6.00, img: "/assets/nutry-caju-com-chocolate.jpg",stock: 10},
  {id: 4, name: "Barra de Cereal Frutas vermelhas", price: 6.00, img: "/assets/nutry-frutas-vermelhas.jpg",stock: 10},
  {id: 5, name: "Barra de Cereal Morango com chocolate", price: 6.00, img: "/assets/nutry-morango-com-chocolate.jpg",stock: 10},
  {id: 6, name: "Trident Abacaxi", price: 3.00, img: "/assets/trident-abacaxi.png",stock: 10},
  {id: 7, name: "Trident Moranco com limão", price: 3.00, img: "/assets/trident-berrylime.png",stock: 10},
  {id: 8, name: "Trident Chiclete", price: 3.00, img: "/assets/trident-chiclete.png",stock: 10},
  {id: 9, name: "Trident Menta", price: 3.00, img: "/assets/trident-menta.png",stock: 10},
  {id: 10, name: "Whey Bar Brigadeiro", price: 10.00, img: "/assets/wheybar-brigadeiro.jpeg", stock:10},
  {id: 11, name: "Whey Bar Chocolate", price: 10.00, img: "/assets/wheybar-chocolate.jpeg", stock:10},
  {id: 12, name: "Whey Bar Morango", price: 10.00, img: "/assets/wheybar-morango.jpeg", stock:10},
]