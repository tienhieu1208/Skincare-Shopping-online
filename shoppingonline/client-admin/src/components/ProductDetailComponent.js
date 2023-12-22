import axios from 'axios';
import React, { Component } from 'react';
import { Form, Button, Col, Row, Modal } from 'react-bootstrap';
import MyContext from '../contexts/MyContext';

class ProductDetail extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      txtID: '',
      txtName: '',
      txtPrice: 0,
      cmbCategory: '',
      imgProduct: '',
      showModal: false,
    };
  }
  render() {
    const cates = this.state.categories.map((cate) => {
      if (this.props.item != null) {
        return (<option key={cate._id} value={cate._id} selected={cate._id === this.props.item.category._id}>{cate.name}</option>);
      } else {
        return (<option key={cate._id} value={cate._id}>{cate.name}</option>);
      }
    });
    return (
      <div>
        <h2 style={{ textAlign: 'center' }}>PRODUCT DETAIL</h2>
        <Form>
          <Row className="mb-3">
            <Col>
              <Form.Label>ID</Form.Label>
              <Form.Control type="text" value={this.state.txtID} readOnly={true} />
            </Col>
            <Col>
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" value={this.state.txtName} onChange={(e) => this.setState({ txtName: e.target.value })} />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Label>Price</Form.Label>
              <Form.Control type="text" value={this.state.txtPrice} onChange={(e) => this.setState({ txtPrice: e.target.value })} />
            </Col>
            <Col>
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" name="fileImage" accept="image/jpeg, image/png, image/gif" onChange={(e) => this.previewImage(e)} />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col>
              <Form.Label>Category</Form.Label>
              <Form.Select onChange={(e) => this.setState({ cmbCategory: e.target.value })}>{cates}</Form.Select>
            </Col>
          </Row>

          <Row>
            <Col>
              <div className="text-center">
                <Button variant="success" type="submit" onClick={(e) => this.btnAddClick(e)}>
                  ADD NEW
                </Button>
                {' '} {' '}
                <Button variant="primary" type="submit" onClick={(e) => this.btnUpdateClick(e)}>
                  UPDATE
                </Button>
                {' '} {' '}
                <Button variant="danger" type="submit" onClick={(e) => this.btnDeleteClick(e)}>
                  DELETE
                </Button>
              </div>
            </Col>
          </Row>

          {/* Delete Confirmation Modal */}
      <Modal show={this.state.showModal} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this product?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={this.handleDelete}>
            Confirm Delete
          </Button>
        </Modal.Footer>
      </Modal>

          <Row>
            <Col>
              <div className="text-center">
                <img src={this.state.imgProduct} width="300px" height="300px" alt="" />
              </div>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
  componentDidMount() {
    this.apiGetCategories();
  }
  componentDidUpdate(prevProps) {
    if (this.props.item !== prevProps.item) {
      this.setState({
        txtID: this.props.item._id,
        txtName: this.props.item.name,
        txtPrice: this.props.item.price,
        cmbCategory: this.props.item.category._id,
        imgProduct: 'data:image/jpg;base64,' + this.props.item.image
      });
    }
  }
  // event-handlers
  handleClose = () => {
    this.setState({ showModal: false });
  };
  handleDelete = () => {
    const id = this.state.txtID;
    if (id) {
      this.apiDeleteProduct(id)
    } else {
      alert('Please input id');
    }
    // Close the modal after the delete action
    this.handleClose();
  };
  btnDeleteClick(e) {
    e.preventDefault();
    this.setState({ showModal: true });
  }
  btnUpdateClick(e) {
    e.preventDefault();
    const id = this.state.txtID;
    const name = this.state.txtName;
    const price = parseInt(this.state.txtPrice);
    const category = this.state.cmbCategory;
    const image = this.state.imgProduct.replace(/^data:image\/[a-z]+;base64,/, ''); // remove "data:image/...;base64,"
    if (id && name && price && category && image) {
      const prod = { name: name, price: price, category: category, image: image };
      this.apiPutProduct(id, prod);
    } else {
      alert('Please input id and name and price and category and image');
    }
  }
  btnAddClick(e) {
    e.preventDefault();
    const name = this.state.txtName;
    const price = parseInt(this.state.txtPrice);
    const category = this.state.cmbCategory;
    const image = this.state.imgProduct.replace(/^data:image\/[a-z]+;base64,/, ''); // remove "data:image/...;base64,"
    if (name && price && category && image) {
      const prod = { name: name, price: price, category: category, image: image };
      this.apiPostProduct(prod);
    } else {
      alert('Please input name and price and category and image');
    }
  }
  previewImage(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        this.setState({ imgProduct: evt.target.result });
      }
      reader.readAsDataURL(file);
    }
  }
  // apis
  apiDeleteProduct(id) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.delete('/api/admin/products/' + id, config).then((res) => {
      const result = res.data;
      if (result) {
        alert('OK BABY!');
        this.apiGetProducts();
      } else {
        alert('SORRY BABY!');
      }
    });
  }
  apiPutProduct(id, prod) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/admin/products/' + id, prod, config).then((res) => {
      const result = res.data;
      if (result) {
        alert('OK BABY!');
        this.apiGetProducts();
      } else {
        alert('SORRY BABY!');
      }
    });
  }
  apiPostProduct(prod) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.post('/api/admin/products', prod, config).then((res) => {
      const result = res.data;
      if (result) {
        alert('OK BABY!');
        this.apiGetProducts();
      } else {
        alert('SORRY BABY!');
      }
    });
  }
  apiGetProducts() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/products?page=' + this.props.curPage, config).then((res) => {
      const result = res.data;
      this.props.updateProducts(result.products, result.noPages, result.curPage);
      if (result.products.length !== 0) {
        this.props.updateProducts(result.products, result.noPages, result.curPage);
      } else {
        const curPage = this.props.curPage - 1;
        axios.get('/api/admin/products?page=' + curPage, config).then((res) => {
          const result = res.data;
          this.props.updateProducts(result.products, result.noPages, curPage);
        });
      }
    });
  }
  apiGetCategories() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/categories', config).then((res) => {
      const result = res.data;
      this.setState({ categories: result });
    });
  }
}
export default ProductDetail;