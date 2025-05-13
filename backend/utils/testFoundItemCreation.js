const axios = require('axios');

async function testFoundItemCreation() {
  try {
    const response = await axios.post('http://localhost:5000/api/found', {
      name: "Test Found Item",
      description: "Test description",
      category: "Miscellaneous",
      dateFound: "2024-06-02",
      locationFound: "SOC",
      user_name: "Test Found User",
      user_email: "kushdastane69211@gmail.com",
      college_id: "MIT123",
      itemFeatures: "N/A",
      secretQuestion: "Test question",
      secretAnswer: "Test answer"
    });
    console.log('Response:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testFoundItemCreation();
