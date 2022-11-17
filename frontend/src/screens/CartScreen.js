import React, { useEffect } from "react"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from "react-bootstrap"
import Message from "../components/Message";
import axios from "axios";
import { addToCart, removeFromCart } from "../actions/cartActions"
// import cors from "cors"
// import Razorpay from "razorpay"

const CartScreen = ({ match, location, history }) => {
  const productId = match.params.id
  const qty = location.search ? Number(location.search.split("=")[1]) : 1
  const dispatch = useDispatch()

  const cart = useSelector((state) => state.cart)
  const { cartItems } = cart

  useEffect(() => {
    if (productId) {
      dispatch(addToCart(productId, qty))
    }
  }, [dispatch, productId, qty])

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id))
  };

  const checkoutHandler = async(amount) => {

        const {data:{key}}=await axios.get("http://localhost:5000/api/getkey")

        const { data:{order}} = await axios.post("http://localhost:5000/api/payment/checkout", {
          amount
      })
      // console.log(data)

      const options = {
        key, // Enter the Key ID generated from the Dashboard
        amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: "INR",
        name: "YashSinha",
        description: "Proshop",
        image: "https://example.com/your_logo",
        order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        callback_url: "https://localhost:5000/api/payment/paymentverification",
        prefill: {
            "name": "Yash Sinha",
            "email": "yash.sinha@example.com",
            "contact": "9999999999"
        },
        notes: {
            "address": "Razorpay Corporate Office"
        },
        theme: {
            "color": "#121212"
        }
    };
    const razor = new window.Razorpay(options);
        razor.open();

    // const { data: { key } } = await axios.get("http://www.localhost:5000/api/payment/getkey")
    
    // const { data: { order } } = await axios.post("http://localhost:5000/api/payment/checkout", {
    //     amount
    // })

    // console.log(order.amount)

    // const options = {
    //     key,
    //     amount: order.amount,
    //     currency: "INR",
    //     name: "Yash Sinha",
    //     description: "RazorPay for E-commerce website",
    //     image: "https://avatars.githubusercontent.com/u/25058652?v=4",
    //     order_id: order.id,
    //     callback_url: "http://localhost:5000/api/pay/paymentverification",
    //     prefill: {
    //         name: "Yash Sinha",
    //         email: "sinha.yash@example.com",
    //         contact: "9999999999"
    //     },
    //     notes: {
    //         "address": "Razorpay Corporate Office"
    //     },
    //     theme: {
    //         "color": "#121212"
    //     }
    // };

    // const razor = new window.Razorpay(options)
    //     razor.open();
    

    // const {data} = await axios.post("http://localhost:3000/api/pay/payment",{amount})
    // console.log(data);
    // history.push('/api/pay/')
}

  return (
    <Row>
      <Col md={8}>
        <h1>Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <Message>
            Your cart is empty <Link to="/">Go Back</Link>
          </Message>
        ) : (
          <ListGroup variant="flush">
            {cartItems.map((item) => (
              <ListGroup.Item key={item.product}>
                <Row>
                  <Col md={2}>
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={3}>
                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                  </Col>
                  <Col md={2}>${item.price}</Col>
                  <Col md={2}>
                    <Form.Control
                      as="select"
                      value={item.qty}
                      onChange={(e) =>
                        dispatch(
                          addToCart(item.product, Number(e.target.value))
                        )
                      }
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                  <Col md={2}>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => removeFromCartHandler(item.product)}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>
                Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                items
              </h2>
              $
              {cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)} 
            </ListGroup.Item>
            <ListGroup.Item> 
                <Button type='button' className='btn-block' disabled={cartItems.length === 0} onClick={()=>checkoutHandler(
              cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2))}>
                    payment
                </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default CartScreen;
