const axios = require('axios');
let jsonData = [];

module.exports.addData = async(req,res)=>{

    try {
        const url = 'https://s3.amazonaws.com/roxiler.com/product_transaction.json';
        const response = await axios.get(url);
        jsonData = response.data;
    
        res.send(jsonData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        res.status(500).send('Internal Server Error');
      }
} 

module.exports.getStatistics = async(req,res)=>{
    try {
        const month = req.query.month;
        
        const selectedMonthData = jsonData.filter(item => {
          const itemMonth = new Date(item.dateOfSale).getMonth() + 1;
          return itemMonth === parseInt(month);
        });
    
        const totalSaleAmount = selectedMonthData.reduce((sum, item) => sum + item.price, 0);
        const totalSoldItems = selectedMonthData.filter(item => item.sold).length;
        const totalNotSoldItems = selectedMonthData.filter(item => !item.sold).length;
    
        res.json({
          totalSaleAmount,
          totalSoldItems,
          totalNotSoldItems
        });
      } catch (error) {
        console.error('Error in fetching statistics:', error);
        res.status(500).send('Internal Server Error');
      }
}


module.exports.getBarchart = async(req,res)=>{
    try {
        const month = req.query.month;
        
        const selectedMonthData = jsonData.filter(item => {
          const itemMonth = new Date(item.dateOfSale).getMonth() + 1;
          return itemMonth === parseInt(month);
        });
    
        const priceRanges = [
          { range: '0 - 100', count: 0 },
          { range: '101 - 200', count: 0 },
          { range: '201 - 300', count: 0 },
          { range: '301 - 400', count: 0 },
          { range: '401 - 500', count: 0 },
          { range: '501 - 600', count: 0 },
          { range: '601 - 700', count: 0 },
          { range: '701 - 800', count: 0 },
          { range: '801 - 900', count: 0 },
          { range: '901 - above', count: 0 }
        ];
    
        selectedMonthData.forEach(item => {
          const price = item.price;
          if (price >= 0 && price <= 100) {
            priceRanges[0].count++;
          } else if (price >= 101 && price <= 200) {
            priceRanges[1].count++;
          } else if (price >= 201 && price <= 300) {
            priceRanges[2].count++;
          } else if (price >= 301 && price <= 400) {
            priceRanges[3].count++;
          } else if (price >= 401 && price <= 500) {
            priceRanges[4].count++;
          } else if (price >= 501 && price <= 600) {
            priceRanges[5].count++;
          } else if (price >= 601 && price <= 700) {
            priceRanges[6].count++;
          } else if (price >= 701 && price <= 800) {
            priceRanges[7].count++;
          } else if (price >= 801 && price <= 900) {
            priceRanges[8].count++;
          } else {
            priceRanges[9].count++;
          }
        });
    
        res.json(priceRanges);
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
}


module.exports.getPichart = async(req,res)=>{
    try {
        const month = req.query.month;
        
        const selectedMonthData = jsonData.filter(item => {
          const itemMonth = new Date(item.dateOfSale).getMonth() + 1;
          return itemMonth === parseInt(month);
        });
    
        const categoryCounts = {};
    
        selectedMonthData.forEach(item => {
          const category = item.category;
          if (categoryCounts[category]) {
            categoryCounts[category]++;
          } else {
            categoryCounts[category] = 1;
          }
        });
    
        const pieChartData = Object.keys(categoryCounts).map(category => {
          return { category, count: categoryCounts[category] };
        });
    
        res.json(pieChartData);
      } catch (error) {
        console.error( error);
        res.status(500).send('Internal Server Error');
      }

}


module.exports.getCombineddata = async(req,res)=>{
    try {
        const month = req.query.month;
    
        const statisticsResponse = await axios.get(`http://localhost:${process.env.PORT}/statistics?month=${month}`);
        const barChartResponse = await axios.get(`http://localhost:${process.env.PORT}/bar-chart?month=${month}`);
        const pieChartResponse = await axios.get(`http://localhost:${process.env.PORT}/pie-chart?month=${month}`);
    
        const combinedData = {
          statistics: statisticsResponse.data,
          barChart: barChartResponse.data,
          pieChart: pieChartResponse.data
        };
    
        res.json(combinedData);
      } catch (error) {
        console.error( error);
        res.status(500).send('Internal Server Error');
      }
}