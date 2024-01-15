//import http
const http = require('http');
//import url
const url = require('url');

const fs = require('fs');

const temp = fs.readFileSync(`${__dirname}/template/overview.html`, 'utf-8');
const tempcard = fs.readFileSync(
	`${__dirname}/template/template-card.html`,
	'utf-8'
);
const tempproduct = fs.readFileSync(
	`${__dirname}/template/product.html`,
	'utf-8'
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const replaceTemplate = (temp, product) => {
	//this function replaces the place holder with the content from the json file.
	let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
	output = output.replace(/{%IMAGE%}/g, product.image);
	output = output.replace(/{%PRICE%}/g, product.price);
	output = output.replace(/{%FROM%}/g, product.from);
	output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
	output = output.replace(/{%QUANTETY%}/g, product.quantity);
	output = output.replace(/{%DESCRIPTION%}/g, product.description);
	output = output.replace(/{%ID%}/g, product.id);

	if (!product.organic)
		output = output.replace(/{%NOT-ORGANIC%}/g, 'not-organic');
	return output;
};

//create server
const server = http.createServer((req, res) => {
	//rauting
	const { query, pathname } = url.parse(req.url, true);

	//overview page
	if (pathname === '/overview' || pathname === '/') {
		res.writeHead(200, { 'content-type': 'text/html' });
		// res.end(Temp) test

		//use map to loop through each element in the json file and create a function that thakes the teplate -card and he elements on the json
		const cardHtl = dataObj
			.map((element) => replaceTemplate(tempcard, element))
			.join('');

		const output = temp.replace('{% PRODUCT-CARDS %}', cardHtl);

		res.end(output);
	}
	//product page
	else if (pathname === '/product') {
		res.writeHead(200, { 'content-type': 'text/html' });
		const product = dataObj[query.id];
		const output = replaceTemplate(tempproduct, product);
		res.end(output);
	}
	//api page
	else if (pathname === '/api') {
		//API / reading a file from json
		res.writeHead(200, { 'content-type': 'application/json' });
		res.end(data);
	} else {
		res.writeHead('404', {
			'content-type': 'text/html',
		});
		res.end('<h1>Page not found</h1>');
	}
});

//listen or request in order to render the avobe response.

server.listen('8000', '127.0.0.1', () => {
	console.log('listening for request.');
});
