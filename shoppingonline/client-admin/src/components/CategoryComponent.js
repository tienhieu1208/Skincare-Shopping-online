import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import { Table, Form, Button } from 'react-bootstrap';
import CategoryDetail from './CategoryDetailComponent';

class Category extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      itemSelected: null
    };
  }
  render() {
    const { categories, itemSelected } = this.state;
  
    return (
      <div className="container mt-3">
        <h2 style={{textAlign: "center"}}>CATEGORY LIST</h2>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((item) => (
              <tr key={item._id} onClick={() => this.trItemClick(item)}>
                <td>{item._id}</td>
                <td>{item.name}</td>
                <td>
                  <Button variant="info" onClick={() => this.trItemClick(item)}>
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div>
          <CategoryDetail item={itemSelected} updateCategories={this.updateCategories} />
        </div>
      </div>
    );
  }
  updateCategories = (categories) => { // arrow-function
    this.setState({ categories: categories });
  }
  componentDidMount() {
    this.apiGetCategories();
  }
  // event-handlers
  trItemClick(item) {
    this.setState({ itemSelected: item });
  }
  // apis
  apiGetCategories() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/categories', config).then((res) => {
      const result = res.data;
      this.setState({ categories: result });
    });
  }
}
export default Category;