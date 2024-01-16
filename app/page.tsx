"use client"
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'


function ProductCard({ productCard, handleCart, quantityInCart }: ProductCardProps) {

  const isMaxQuantityReached = quantityInCart >= productCard.stock;

  const cardStyles = isMaxQuantityReached ? "inline-flex flex-col items-start gap-[10px] relative opacity-50" 
                                          : "inline-flex flex-col items-start gap-[10px] relative";

  
  const handleClick = () => {
    if (!isMaxQuantityReached) {
      handleCart(productCard, true);
    }
  };


  function formatPrice(price: number){
    let priceStr = price.toFixed(2)

    let leftPositon: string = 'left-[169px]'
    if (price > 9) {
      leftPositon = 'left-[156px]'
    }
  

    const [reais, centavos] = priceStr.split('.')

    
    return { reais, centavos, leftPositon }
  }

  const {reais, centavos, leftPositon} = formatPrice(productCard.price)

  return(
    <div className={cardStyles} onClick={() => handleClick()}>
      <div className="relative w-[251px] h-[129px] bg-[#f2f2f2] rounded-[13px] border-2 border-solid border-black" />
      <div className="absolute w-[62px] h-[62px] top-[83px] left-[229px] bg-[#f2f2f2] rounded-[9px] border-2 border-solid border-black">
        <Image src='/assets/icon.png' alt='cart' width={500} height={500} className='p-[3px]'></Image>  
      </div>
      <p className="absolute w-[94px] top-[12px] left-[128px] [font-family:'Allerta',Helvetica] font-normal text-black text-[14px] tracking-[0] leading-[normal]">
        {productCard.name}
      </p>
      <div className="absolute w-[90px] h-[40px] top-[78px] left-[128px] bg-[#052704] rounded-[20px]" />
      <div className="absolute w-[17px] top-[85px] left-[136px] [font-family:'Alfa_Slab_One',Helvetica] font-normal text-white text-[10px] tracking-[0] leading-[normal] whitespace-nowrap">
        R$
      </div>
      <Image src={productCard.img} alt={productCard.name} width={500} height={500} className="absolute w-[107px] h-[108px] top-[10px] left-[10px] object-cover" ></Image>
      <div className={`absolute w-[23px] top-[82px] ${leftPositon} [font-family:'Alfa_Slab_One',Helvetica] font-normal text-white text-[24px] tracking-[0] leading-[normal]`}>
         {reais},
      </div>
      <div className="absolute top-[85px] left-[189px] [font-family:'Alfa_Slab_One',Helvetica] font-normal text-white text-[13px] tracking-[0] leading-[normal]">
        {centavos}
      </div>
    </div>
  )
}

function ProductCatalog({ products, handleCart, cart }: ProductCatalogProps) {

  const rows: JSX.Element[] = [];

  products.forEach((product) => {
    const quantityInCart = cart.find(item => item.id === product.id)?.quantityInCart || 0;

    rows.push(<ProductCard productCard={product} key={product.id} handleCart={handleCart} quantityInCart={quantityInCart}/>);
  });

  

  return(
    <section className="grid grid-cols-2 gap-[40px] ml-[60px] mr-[78px] mt-[50px] mb-[100px]">{rows}</section>
  )
}

function CartTable( { productCart, handleCart  }: CartTableProps) {

  const isMaxQuantityReached = productCart.quantityInCart >= productCart.stock

  const addButtonStyles = isMaxQuantityReached? 'opacity-30' : ''

  const handleAdd= () => {
    if(!isMaxQuantityReached) {
      handleCart(productCart, true)
    }
  }

  return(
    <div className='grid grid-rows-1 grid-cols-3 justify-items-center items-center m-[5px] bg-slate-200 rounded-lg'>
      <div className='grid grid-rows-1 grid-cols-3 justify-items-center'>
        <div onClick={() => {handleCart(productCart, false)}}>
          <Image src='/assets/minus.png' alt='minus' width={25} height={25}></Image>
        </div> {productCart.quantityInCart} 
        <div className={addButtonStyles} onClick={() => {handleAdd()}}>
        <Image src='/assets/plus.png' alt='plus' width={25} height={25}></Image>
        </div>
      </div>
      <div><p className='text-center'>{productCart.name}</p></div>
      <div className='place-self-start ml-[8rem] self-center'>R$ {productCart.price.toFixed(2)}</div>
    </div>
  )
}

function CartEmpty() {
  return(
    <div className='flex flex-col items-center mt-[10px] opacity-30'>
      <div>
        <Image src='/assets/cart.png' alt='cartEmpty' width={50} height={50}></Image>
      </div>
      <p className='mt-[5px]'>Você ainda não fez nenhum pedido</p>
      
    </div>
  )
}

function LoadingModal() {
  return(
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="bg-white p-5 rounded-lg shadow">
        <h2 className="text-lg font-bold">Carregando...</h2>
        {/* Aqui você pode adicionar um spinner ou outra animação */}
      </div>
    </div>
  )
}

function ShoppingCart( { productsCart, handleCart, clearCart }: ShoppingCartProps) {

  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    window.electron.receive('fromMain', (data) => {
        console.log('Chegou do main:', data);

        if(data === 'Loop: 0'){
          setLoading(true)

        } else if(data === 'end') {
          setLoading(false)
        }
        // Faça algo com os dados recebidos
    });
  }, []);

  const sendStringRequests = (products: CartData[]) => {

    const ordenedProducts = [...products].sort((a, b) => a.id - b.id);

    let totalItens = ordenedProducts.reduce((total, product) => total + product.quantityInCart, 0);
    let request = `${totalItens.toString().padStart(3, '0')};`;

    ordenedProducts.forEach(product => {
      for(let i=0; i<product.quantityInCart; i++) {
        request += `${product.coord};`;
      }
    });

    request = request.slice(0,-1);

    window.electron.sendData(request);
  }

  const updateGlobalStock = useCallback(() => {
    const updatedStock: UpdatedStock = {}
 

    // Atualiza o estoque global baseado nos itens do carrinho.

    productsCart.forEach(cartItem => {
      

      const productIndex = PRODUCTS.findIndex(p => p.id === cartItem.id)
      if(productIndex !== -1) {
        if(PRODUCTS[productIndex].stock >= cartItem.quantityInCart) {
          PRODUCTS[productIndex].stock -= cartItem.quantityInCart
          console.log(PRODUCTS[productIndex].stock)

          updatedStock[cartItem.id] = {
            id: cartItem.id,
            quantity: PRODUCTS[productIndex].stock
          }

        } else {
          console.error('Estoque insuficiente para o produto: ', cartItem.name);
          throw new Error('Estoque insuficiente')
        }
      }
    })

    clearCart();

    window.electron.updateStorage(updatedStock);
  }, [productsCart, clearCart])

  const handleConfirmOrder = useCallback(() => {
    try {
      updateGlobalStock();
      sendStringRequests(productsCart);
      console.log('aeiuaofufaoi')
      console.log(PRODUCTS)
    } catch (error) {
      console.error(error)
    }
  }, [productsCart, sendStringRequests, updateGlobalStock])

  const rows: JSX.Element[] = [];
  let total: number = 0;

  productsCart.map((item) => {
    rows.push(<CartTable key={item.id} productCart={item} handleCart={handleCart}></CartTable>);
    total += item.quantityInCart * item.price;
  })

  const isCartEmpty = productsCart.length === 0;

  return(
    <>
    <div>{isLoading && <LoadingModal></LoadingModal>}</div>
    <div className="bg-white flex flex-col  h-[30vh] border-t-[5px] border-black">
      <div className='grid grid-rows-1 grid-cols-3 gap-4 p-[10px]'>
        <div className='flex items-center'>
          <p>SEU CARRINHO DE COMPRAS</p>
          <Image src='/assets/cart.png' alt='cart' width={25} height={25} className='ml-[10px]'></Image>
        </div>
        <button 
          className='bg-gray-100 rounded-lg shadow-[inset_0px_4px_4px_#00000040,0px_4px_4px_#00000040]' 
          onClick={() => {clearCart()}}>
          CANCELAR
        </button>
        <button 
          className={`rounded-lg ${isCartEmpty ? 'bg-gray-100' : 'bg-green-500'} shadow-[inset_0px_4px_4px_#00000040,0px_4px_4px_#00000040]`}
          onClick={() => {handleConfirmOrder()}}
          disabled={isCartEmpty}>
          CONFIRMAR PEDIDO
        </button>
      </div>
      <div className='flex-grow overflow-y-auto scrollbar-hide m-[30px]'>
        {isCartEmpty ? <CartEmpty></CartEmpty> : rows}
      </div>
      <div className='flex p-2 justify-between'>
        <div className='mb-[30px] ml-[30px]'>
          <Image src="/assets/gift.png" alt="gift" width={60} height={60}></Image>
        </div>
        <div className='mr-[47px]'>SubTotal: R$ {total.toFixed(2)}</div>

      </div>
    </div>
    
    </>
  )
}

export default function Home() {

  const [cart, setCart] = useState<CartData[]>([]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

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

  return(
    <div className='flex flex-col h-screen'>
      <div className='flex-shrink-0 flex justify-center items-center mt-[5px]' >
        <Image src="/assets/logo.png" alt="logo" width={150} height={150}></Image>
      </div>
      <div className='flex-grow overflow-auto scrollbar-hide'>
        <ProductCatalog products={PRODUCTS} handleCart={handleCart} cart={cart}></ProductCatalog>
      </div>
      <div className='flex-shrink-0 h-300'>
        <ShoppingCart productsCart={cart} handleCart={handleCart} clearCart={clearCart}></ShoppingCart>
      </div>
    </div>
  )
}

interface CartTableProps {
  productCart: CartData;
  handleCart: (product: ProductData, add: boolean) => void;
}

interface ShoppingCartProps {
  productsCart: CartData[];
  handleCart: (product: ProductData, add: boolean) => void;
  clearCart: () => void;
}

interface CartData extends ProductData {
  quantityInCart: number;
}

interface ProductCardProps {
  productCard: ProductData;
  handleCart: (product: ProductData, add: boolean) => void;
  quantityInCart: number;
}

interface ProductCatalogProps {
  products: ProductData[];
  handleCart: (product: ProductData, add: boolean) => void;
  cart: CartData[];
}

interface ProductData {
  id: number,
  coord: number,
  name: string,
  price: number,
  img: string,
  stock: number,
  quantityInCart?: number;
}

const PRODUCTS: ProductData[] = [
  {id: 1, coord: 11,name: "Barra de Cereal Avelã com chocolate", price: 6.99, img: "/assets/nutry-avela-com-chocolate.jpg", stock: 10},
  {id: 2, coord: 12,name: "Barra de Cereal Bolo de chocolate", price: 6.50, img: "/assets/nutry-bolo-de-chocolate.jpg",stock: 10},
  {id: 3, coord: 13,name: "Barra de Cereal Caju com chocolate", price: 6.62, img: "/assets/nutry-caju-com-chocolate.jpg",stock: 10},
  {id: 4, coord: 14,name: "Barra de Cereal Frutas vermelhas", price: 6.73, img: "/assets/nutry-frutas-vermelhas.jpg",stock: 10},
  {id: 5, coord: 15,name: "Barra de Cereal Morango com chocolate", price: 6.00, img: "/assets/nutry-morango-com-chocolate.jpg",stock: 10},
  {id: 6, coord: 21,name: "Trident Abacaxi", price: 3.00, img: "/assets/trident-abacaxi.png",stock: 10},
  {id: 7, coord: 22,name: "Trident Moranco com limão", price: 3.00, img: "/assets/trident-berrylime.png",stock: 10},
  {id: 8, coord: 23,name: "Trident Chiclete", price: 3.00, img: "/assets/trident-chiclete.png",stock: 10},
  {id: 9, coord: 24,name: "Trident Menta", price: 3.00, img: "/assets/trident-menta.png",stock: 10},
  {id: 10,coord: 25,name: "Whey Bar Brigadeiro", price: 10.20, img: "/assets/wheybar-brigadeiro.jpeg", stock:10},
  {id: 11,coord: 31,name: "Whey Bar Chocolate", price: 10.03, img: "/assets/wheybar-chocolate.jpeg", stock:10},
  {id: 12,coord: 41,name: "Whey Bar Morango", price: 10.99, img: "/assets/wheybar-morango.jpeg", stock:10}
]