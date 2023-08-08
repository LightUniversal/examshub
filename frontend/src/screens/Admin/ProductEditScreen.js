import { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import FormContainer from "../../components/FormContainer";
import {
  useUpdateProductMutation,
  useUploadProductImageMutation,
} from "../../slices/productsApiSlice";
import {
  useGetProductQuery,
  useCreateQuestionMutation,
} from "../../slices/productApiSlice";
import { FaArrowAltCircleLeft, FaEdit, FaPlusCircle, FaPlusSquare } from "react-icons/fa";

const ProductEditScreen = () => {
  // Get the productId
  const { id: productId } = useParams();

  // Components states
  const [name, setName] = useState("");
  const [courseOutline, setCourseOutline] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [question, setQuestion] = useState("");
  const [price, setPrice] = useState("");
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");
  const [d, setD] = useState("");
  const [topic, setTopic] = useState("");
  const [answer, setAnswer] = useState("");
  const [solution, setSolution] = useState("");
  const [image, setImage] = useState("");

  // get the current data
  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductQuery(productId);
  // initial the update
  const [updateProduct, { isLoading: loadingUpdate }] =
    useUpdateProductMutation();
  const [uploadProductImage, { isLoading: loadingImage }] =
    useUploadProductImageMutation();

  const [createQuestion, { isLoading: loadingQuestions }] =
    useCreateQuestionMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (product) {
      setCourseOutline(product.courseOutline);
      setPrice(product.price);
      setCountInStock(product.countInStock);
      setImage(product.image);
      setName(product.name);
    }
  }, [product]);
  const addQuestions = async (e) => {
    e.preventDefault();
    try {
      await createQuestion({
        productId,
        question,
        topic,
        solution,
        answer,
        options: [a, b, c, d],
      }).unwrap();
      refetch();
      toast.success("Questions added");
      setAnswer(""),
        setA(""),
        setB(""),
        setC(""),
        setSolution(""),
        setTopic(""),
        setD(""),
        setQuestion("");
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const updatedProduct = {
      productId,
      name,
      courseOutline,
      countInStock,
      image,
      price,
    };
    const res = await updateProduct(updatedProduct);
    console.log(res);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Product updated!");
      navigate("/admin/productlist");
    }
  };
  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };
  return (
    <>
      <Link to="/admin/productlist" className="btn btn-light my-3">
        <FaArrowAltCircleLeft /> Go Back
      </Link>
      <FormContainer>
        <h2 className=" border-bottom ">
          Edit Product
          <FaEdit
            className=" text-primary "
            style={{ position: "relative", top: "-2px", fontSize: "20px" }}
          />
        </h2>
        {loadingUpdate && <Loader />}

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message varient="danger">{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="countInStock">
              <Form.Label>countInStock</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter countInStock"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="image" className="my-2">
              <Form.Label>Upload Product Image</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter image url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              ></Form.Control>
              <Form.Control
                type="file"
                label="Choose file"
                onChange={uploadFileHandler}
              ></Form.Control>
            </Form.Group>
            {loadingImage && <Loader />}
            <Form.Group controlId="CourseOutline" className="my-2">
              <Form.Label>Course Outline</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Course Outline"
                value={courseOutline}
                onChange={(e) => setCourseOutline(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button
              variant="primary"
              disabled={loadingQuestions}
              className="my-2"
              type="submit"
            >
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
      <FormContainer >
        <Form onSubmit={addQuestions} className="mt-4 ">
          <h3 className=" border-bottom ">Add Questions </h3>
          <Form.Group controlId="question">
            <Form.Label>Question</Form.Label>
            <Form.Control
              as="textarea"
              type="text"
              placeholder="Enter Question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="options" className="mt-2 mb-1">
            <Form.Label className="my-0">Option A</Form.Label>

            <Form.Control
              type="text"
              placeholder="Enter Option A"
              value={a}
              onChange={(e) => setA(e.target.value)}
              className="my-2 rounded-0 "
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="b">
            <Form.Label className="my-0">Option B</Form.Label>

            <Form.Control
              type="text"
              placeholder="Enter Option B"
              value={b}
              onChange={(e) => setB(e.target.value)}
              className="my-2 rounded-0 "
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="c">
            <Form.Label className="my-0">Option C</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Option C"
              value={c}
              onChange={(e) => setC(e.target.value)}
              className="my-2 rounded-0 "
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="d" className="my-1">
            <Form.Label className="my-0">Option D</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Option D"
              value={d}
              onChange={(e) => setD(e.target.value)}
              className="my-2 rounded-0 "
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="answer">
            <Form.Label
              className="my-0"
              style={{ marginBottom: "0px !important" }}
            >
              Answer
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="my-2 rounded-0 "
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId="solution">
            <Form.Label
              className="my-0"
              style={{ marginBottom: "0px !important" }}
            >
              Solution
            </Form.Label>

            <Form.Control
              as="textarea"
              type="text"
              placeholder="Enter the Solution"
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              className="my-2"
            ></Form.Control>
          </Form.Group>
          <Button type="submit">
            <FaPlusCircle /> Add Question
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default ProductEditScreen;
