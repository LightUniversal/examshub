import { Link } from "react-router-dom";
import { Carousel, Image } from "react-bootstrap";
import Loader from "./Loader";
import Message from "./Message";
import { useGetTopMaterialsQuery } from "../slices/productsApiSlice";
import { FaEdit } from "react-icons/fa";

const ProductCarousel = () => {

  const {data: materials, isLoading, error} = useGetTopMaterialsQuery();

  return isLoading ? <p>Loading...</p> : error ? <Message varient="danger">{error}</Message> : (
    <Carousel pause="hover" className=" bg-dark-subtle carousel   mb-4 " style={{height:"100%"}}>
      {materials.map(material => (
        <Carousel.Item key={material._id}>
          <Link to={`/product/${material._id}`}>
            <Image src={material.image} alt={material.name} width="100%" className="mb-5" />
            <Carousel.Caption className=" carousel-caption ">
              <h3 className="px-3 mt-0">
                {material.name} (${material.price})
              </h3>
              
            </Carousel.Caption>
            
          </Link>
        </Carousel.Item>
        
        
      ))}
    </Carousel>
  )
    
}

export default ProductCarousel
