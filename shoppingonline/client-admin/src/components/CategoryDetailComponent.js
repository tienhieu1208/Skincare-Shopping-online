import axios from 'axios';
import React, { Component } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import MyContext from '../contexts/MyContext';

class CategoryDetail extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      txtID: '',
      txtName: '',
      showModal: false,
    };
  }
  render() {
    return (
      <div>
        <h2 style={{ textAlign: 'center' }}>CATEGORY DETAIL</h2>
        <Form>
          <Form.Group className="mb-3" controlId="formCategoryID">
            <Form.Label>ID</Form.Label>
            <Form.Control type="text" value={this.state.txtID} readOnly={true} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formCategoryName">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" value={this.state.txtName} onChange={(e) => this.setState({ txtName: e.target.value })} />
          </Form.Group>

          <div style={{ textAlign: 'center' }}>
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
        </Form>
        {/* Delete Confirmation Modal */}
      <Modal show={this.state.showModal} onHide={this.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this category?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={this.handleDelete}>
            Confirm Delete
          </Button>
        </Modal.Footer>
      </Modal>
      </div>
    );
  }
  // event-handlers
  handleClose = () => {
    this.setState({ showModal: false });
  };
  handleDelete = () => {
    const id = this.state.txtID;
    if (id) {
      this.apiDeleteCategory(id);
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
    if (id && name) {
      const cate = { name: name };
      this.apiPutCategory(id, cate);
    } else {
      alert('Please input id and name');
    }
  }
  btnAddClick(e) {
    e.preventDefault();
    const name = this.state.txtName;
    if (name) {
      const cate = { name: name };
      this.apiPostCategory(cate);
    } else {
      alert('Please input name');
    }
  }
  // apis
  apiDeleteCategory(id) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.delete('/api/admin/categories/' + id, config).then((res) => {
      const result = res.data;
      if (result) {
        alert('OK BABY!');
        this.apiGetCategories();
      } else {
        alert('SORRY BABY!');
      }
    });
  }
  apiPutCategory(id, cate) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/admin/categories/' + id, cate, config).then((res) => {
      const result = res.data;
      if (result) {
        alert('OK BABY!');
        this.apiGetCategories();
      } else {
        alert('SORRY BABY!');
      }
    });
  }
  apiPostCategory(cate) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.post('/api/admin/categories', cate, config).then((res) => {
      const result = res.data;
      if (result) {
        alert('OK BABY!');
        this.apiGetCategories();
      } else {
        alert('SORRY BABY!');
      }
    });
  }
  apiGetCategories() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/categories', config).then((res) => {
      const result = res.data;
      this.props.updateCategories(result);
    });
  }
  componentDidUpdate(prevProps) {
    if (this.props.item !== prevProps.item) {
      this.setState({ txtID: this.props.item._id, txtName: this.props.item.name });
    }
  }
}
export default CategoryDetail;