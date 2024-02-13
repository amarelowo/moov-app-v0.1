"use client"
import { handleWebpackExternalForEdgeRuntime } from 'next/dist/build/webpack/plugins/middleware-plugin';
import Image from 'next/image'
import { use, useCallback, useEffect, useState } from 'react'


function ProductCard({ productCard, handleCart, isMaxQuantityReached, isProductsLoaded }: ProductCardProps) {

  
  // console.log(isMaxQuantityReached, productCard.name)

  // if(isProductsLoaded && )

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

function ProductCatalog({ products, handleCart, cart, isProductsLoaded }: ProductCatalogProps) {

  const rows: JSX.Element[] = [];

  products.forEach((product) => {
    const quantityInCart = cart.find(item => item.id === product.id)?.quantityInCart || 0;

    console.log(quantityInCart, product.stock, product.name)
    const isMaxQuantityReached = quantityInCart >= product.stock;

    rows.push(<ProductCard productCard={product} key={product.id} handleCart={handleCart} isMaxQuantityReached={isMaxQuantityReached} isProductsLoaded={isProductsLoaded}/>);
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
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex flex-col items-center gap-6 z-40">
      <div className="bg-blue-baby p-5 rounded-lg h-[600px] w-[490px] flex flex-col items-center justify-between text-[32px] text-white mt-[160px]">
        <div className='flex flex-col items-center mt-[103px]'>
          <h2 className="">Aguarde alguns</h2><h2>instantes...</h2>
        </div>
        <Image src='/assets/ampulheta.png' alt='ampulheta' width={100} height={100} className='animate-spin-half mb-[195px] '></Image>
      </div>
      <div>
      </div>
    </div>
  )
}

function PaymentModal({ onConfirm }: PaymentModalProps) {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex flex-col items-center gap-6 z-40">
      <div className="bg-white p-5 rounded-lg w-[490px] h-[600px]  mt-[160px]">
        <h2>Confirmar Pedido</h2>
       
        {/* Outros elementos do modal */}
      </div>
      <div className='bg-green-500 rounded-[14px] h-[60px] w-[250px] flex items-center justify-center'>
        <button onClick={() => onConfirm()} className='text-white font-bold'>CONFIRMAR</button>
      </div>
    </div>
  )
}

function FinalModal({ onConfirm }: PaymentModalProps) {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex flex-col items-center gap-6 z-40" onClick={() => {onConfirm()}}>
      <div className="bg-green-500 p-5 rounded-lg w-[490px] h-[600px] flex flex-col justify-between items-center text-white text-[24px]  mt-[160px]">
        <div className='flex flex-col items-center mt-8'>
          <h2>Retire seu(s) produto(s)</h2> <h2>no alçapão.</h2>
        </div>
          
        <Image src='/assets/check.png' alt='check' width={200} height={250}></Image>
        <div className='flex flex-col items-center mb-10'>
          <h2>Obrigado por comprar</h2> <h2>conosco!</h2>
        </div>
        
      </div>
      <div className='bg-green-500 rounded-[14px] h-[60px] w-[250px] flex items-center justify-center' onClick={() => onConfirm()}>
        <button className='text-white font-bold'>CONTINUAR COMPRANDO</button>
      </div>
    </div>
  );
}


function ShoppingCart( { productsCart, handleCart, clearCart }: ShoppingCartProps) {

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [showFinalModal, setShowTFinalModal] = useState(false);

  useEffect(() => {
    window.electron.receive('fromMain', (data) => {
        console.log('Chegou do main:', data);

        if(data === 'end'){
          setShowLoadingModal(false)
          setShowTFinalModal(true)
        }
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

    request = 'p;' + request;
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
    setShowPaymentModal(true)
  }, [])

  const handleFinish = () => {
    setShowTFinalModal(false)
  }

  const handleFinalConfirm = useCallback(() => {
    setShowPaymentModal(false)
    setShowLoadingModal(true)
    updateGlobalStock()
    sendStringRequests(productsCart);
    
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
    {showPaymentModal && <PaymentModal onConfirm={handleFinalConfirm}></PaymentModal>}
    {showLoadingModal && <LoadingModal></LoadingModal>}
    {showFinalModal && <FinalModal onConfirm={handleFinish}></FinalModal>}
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
          <Image src="/assets/gift.png" className='w-auto h-auto' alt="gift" width={60} height={60}></Image>
        </div>
        <div className='mr-[47px]'>SubTotal: R$ {total.toFixed(2)}</div>

      </div>
    </div>
    
    </>
  )
}

function TableRecharging({ id, img, name, quantity, onCheckboxChange }: TableRechargingProps) {

  return(
    <div className='grid grid-cols-8 gap-3 text-[12px] mt-[10px]'>
      <div className='flex justify-center'>
        <input id={`checkbox-${id}`} type='checkbox' onChange={(e) => {onCheckboxChange(id, e.target.checked)}} className='ml-3 w-5 h-5'/>
      </div>
      <div className='bg-gray-300 flex justify-center items-center'>
        {id}
      </div>
      <div className='bg-gray-300 col-span-2 flex justify-center items-center'>
        <Image src={img} alt={name} width={50} height={50}></Image>
      </div>
      <div className='bg-gray-300 col-span-3 flex justify-center items-center pl-1'>
       {name}
      </div>
      <div className='bg-gray-300 flex justify-center items-center'>
        x{quantity}
      </div>
    </div>
  )
}

function ModalRechargingMachine( { handleClose }: ModalRechargingMachineProps) {

  type CheckedState = {
    [key: number]: boolean
  }

  const [checkedState, setCheckedState] = useState<CheckedState>({})

  const handleCheckboxChange = (id: number, isChecked: boolean) => {
    setCheckedState(prevState => ({ ...prevState, [id]: isChecked }));
  };

  const allChecked = PRODUCTS.every(product => checkedState[product.id]);


  const tableRows: JSX.Element[] = [];

  function finalizeRechare() {
    const updatedStock: UpdatedStock = {}

    PRODUCTS.forEach(product => {
      product.stock = product.maxStock;

      updatedStock[product.id] = {
        id: product.id,
        quantity: product.maxStock
      }

    })

    window.electron.updateStorage(updatedStock)

    handleClose()

  }

  PRODUCTS.map((product) => {
    tableRows.push(<TableRecharging key={product.id} id={product.id} img={product.img} name={product.name} quantity={product.maxStock - product.stock} onCheckboxChange={handleCheckboxChange}></TableRecharging>
  )})

  return(
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
      <div className="bg-white w-[465px] h-[900px] rounded-lg flex flex-col justify-between">
        <div className='border-b-[5px] border-black h-[100px] flex items-center p-10'>
          <h2 className='text-[24px] font'>Área de recarga</h2>
        </div>
        <div className='bg-gray-100 grow m-[20px]'>
          <p className='text-[14px]'>Recarregue os compartimentos seguindo a ordem abaixo: </p>
          <div className='grid grid-cols-8 gap-3 text-[12px] mt-[20px]'>
            <div>
            </div>
            <div className='bg-gray-300 flex justify-center'>
              N°
            </div>
            <div className='bg-gray-300 col-span-2 flex justify-center'>
              Imagem
            </div>
            <div className='bg-gray-300 col-span-3 flex justify-center'>
              Nome
            </div>
            <div className='bg-gray-300 flex justify-center'>
              Qnt.
            </div>
          </div>
          <div className='h-[600px] overflow-auto scrollbar-hide'>
            {tableRows}
          </div>
        </div>
        <div className='flex justify-center items-center h-[150px]'>
          <button className={`${allChecked ? 'bg-green-500':'bg-gray-100'}  pl-8 pr-8 rounded-lg text-[24px]`} onClick={() => finalizeRechare()} disabled={!allChecked}>
            FINALIZAR RECARGA
          </button>
          
        </div>
      </div>
    </div>
  )
}

export default function Home() {

  const [cart, setCart] = useState<CartData[]>([]);
  const [isRecharge, setIsRecharge] = useState(false);
  const [products, setProducts] = useState<ProductData[]>(PRODUCTS)
  const [productsLoaded, setProductsLoaded] = useState(false)



  useEffect(() => {
    // ... existing useEffect code

    // Inactivity detection logic
    let inactivityTimer: any;

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        window.electron.inactivityDetection()
      }, 300000); // 1 minute
    };

    window.addEventListener('mousemove', resetTimer);
    resetTimer(); // Initialize timer at component mount

    // Clean up
    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener('mousemove', resetTimer);
    };
  }, []);


  function handleClose() {
    setIsRecharge(false)
  }

  useEffect(() => {
    window.electron.requestStock()
    console.log('request-stock pedido')

    window.electron.onStockData((stock: Record<string, { quantity: number }>) => {

      Object.keys(stock).forEach(productId => {
        const index = PRODUCTS.findIndex(product => product.id === parseInt(productId, 10));
    
        if (index !== -1) {
          PRODUCTS[index].stock = stock[productId].quantity;
        }
      });

    setProducts(PRODUCTS);
    setProductsLoaded(true)  
      
    })
  })

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
    <>
    {productsLoaded?
    
      <>
      {isRecharge? <ModalRechargingMachine handleClose={handleClose}></ModalRechargingMachine>: null}
      <div className='flex flex-col h-screen'>
        <div className='flex-shrink-0 flex justify-center items-center mt-[5px]'>
          <Image  onClick={() => setIsRecharge(true)}  src="/assets/logo.png" className='w-auto h-auto' alt="logo" width={150} height={150} priority={true}></Image>
        </div>
        <div className='flex-grow overflow-auto scrollbar-hide'>
          <ProductCatalog products={products} handleCart={handleCart} cart={cart} isProductsLoaded={productsLoaded}></ProductCatalog>
        </div>
        <div className='flex-shrink-0 h-300'>
          <ShoppingCart productsCart={cart} handleCart={handleCart} clearCart={clearCart}></ShoppingCart>
        </div>
      </div>
    </>
    : 
    <div className='h-screen flex justify-center items-center'>
      <Image src='/assets/logo.png' alt='logoLoading' width={500} height={500}></Image>
    </div> }
  </>
  
  )
}

interface PaymentModalProps {
  onConfirm: () => void
}

interface ModalRechargingMachineProps {
  handleClose: () => void
}

interface TableRechargingProps {
  id: number,
  img: string,
  name: string,
  quantity: number,
  onCheckboxChange: ( id: number, isChecked: boolean) => void
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
  isMaxQuantityReached: boolean;
  isProductsLoaded: boolean;
}

interface ProductCatalogProps {
  products: ProductData[];
  handleCart: (product: ProductData, add: boolean) => void;
  cart: CartData[];
  isProductsLoaded: boolean;
}

interface ProductData {
  id: number,
  coord: number,
  name: string,
  price: number,
  img: string,
  stock: number,
  maxStock: number,
  quantityInCart?: number;
}

let PRODUCTS: ProductData[] = [
  {id: 1, coord: 11,name: "Barra de Cereal Avelã com chocolate",    price: 6.99,  img: "/assets/nutry-avela-com-chocolate.jpg",   stock: 0, maxStock: 20},
  {id: 2, coord: 21,name: "Barra de Cereal Bolo de chocolate",      price: 6.50,  img: "/assets/nutry-bolo-de-chocolate.jpg",     stock: 0, maxStock: 20},
  {id: 3, coord: 31,name: "Barra de Cereal Caju com chocolate",     price: 6.62,  img: "/assets/nutry-caju-com-chocolate.jpg",    stock: 0, maxStock: 20},
  {id: 4, coord: 41,name: "Barra de Cereal Frutas vermelhas",       price: 6.73,  img: "/assets/nutry-frutas-vermelhas.jpg",      stock: 0, maxStock: 20},
  {id: 5, coord: 15,name: "Barra de Cereal Morango com chocolate",  price: 6.00,  img: "/assets/nutry-morango-com-chocolate.jpg", stock: 0, maxStock: 20},
  {id: 6, coord: 21,name: "Trident Abacaxi",                        price: 3.00,  img: "/assets/trident-abacaxi.png",             stock: 0, maxStock: 20},
  {id: 7, coord: 22,name: "Trident Moranco com limão",              price: 3.00,  img: "/assets/trident-berrylime.png",           stock: 0, maxStock: 20},
  {id: 8, coord: 23,name: "Trident Chiclete",                       price: 3.00,  img: "/assets/trident-chiclete.png",            stock: 0, maxStock: 20},
  {id: 9, coord: 24,name: "Trident Menta",                          price: 3.00,  img: "/assets/trident-menta.png",               stock: 0, maxStock: 20},
  {id: 10,coord: 25,name: "Whey Bar Brigadeiro",                    price: 10.20, img: "/assets/wheybar-brigadeiro.jpeg",         stock: 0, maxStock: 20},
  {id: 11,coord: 31,name: "Whey Bar Chocolate",                     price: 10.03, img: "/assets/wheybar-chocolate.jpeg",          stock: 0, maxStock: 20},
  {id: 12,coord: 41,name: "Whey Bar Morango",                       price: 10.99, img: "/assets/wheybar-morango.jpeg",            stock: 0, maxStock: 20}
]