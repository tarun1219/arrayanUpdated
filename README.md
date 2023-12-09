# Arrayan

Arrayan is a Food Supply Chain application built on the blockchain fabric of Resilient DB that tracks the products, by-products, and process history through the Food Supply Chain.

- Web Application: Built using React JS, [Create React App](https://github.com/facebook/create-react-app), [React Official Website](https://react.dev/)
- Database: Powered by [ResilientDB](https://resilientdb.com/)
- Theme: BLK Design System React, [BLK Design System Pro React](https://demos.creative-tim.com/blk-design-system-pro-react/?_ga=2.58939236.839164262.1702005007-948628969.1702005007#/presentation)

## Modifications

We have modified the existing [Resilient DB GraphQL APIs](https://github.com/ResilientApp/ResilientDB-GraphQL) catering the needs of a blockchain-based food supply chain and added a new API to fetch the products in the [forked repo](https://github.com/Amoolya-Reddy/ResilientDB-GraphQL)

## Features and User Guide

### Home Page

- Provides a general overview of the solution offered through the website.
- **Getting Started**: To access the portal's features, users first need to register and log in. Once logged in, they can unlock functionalities such as inventory management and search capabilities.
- **Live Inventory Visualization**: The Real-time Display provides an instant, visual representation of the current status of the inventory, ensuring up-to-the-moment insights.

### Inventory

- **Seamless Upload Process**: Allows consumers to easily upload Excel files containing inventory data. Multiple Excel files can be uploaded and loaded consecutively.
- **Transparent Inventory View**: Shows a clear and accessible display of updated inventory information visible to consumers.

### Search

- **Search Option**: Enables users to search and track any final product through the food supply chain.
- **Visualizes Supply Chain**: Provides a comprehensive supply chain mapping of each product's entire supply chain and process details.
- **Claiming By-Products**: Consumers can easily claim by-products in the process, fostering a circular economy. This feature empowers consumers to actively participate in sustainable practices. The consumer can communicate with the organizations using this feature through email.

## Steps to run the system
Please follow the detailed procedure below and ensure that every step is successful.

### Setup Python3.10
Ensure you have Python3.10, otherwise download it and set it up as default.

### Setup ResilientDB
You will need to clone the ResilientDB repo to get started:

    git clone https://github.com/resilientdb/resilientdb.git

Then navigate inside the ResilientDB directory:
    
    cd resilientdb

Install dependencies:
    
    sh INSTALL.sh

Run ResilientDB KV Service (this may take a few minutes for the first time):
    
    ./service/tools/kv/server_tools/start_kv_service.sh

### Setup Crow HTTP server, SDK, and GraphQL server
You will need to clone the ResilientDB GraphQL repo to get started:
    
    git clone https://github.com/Amoolya-Reddy/ResilientDB-GraphQL
    
Then navigate inside the ResilientDBGraphQL directory:
    
    cd ResilientDB-GraphQL

Install the Crow dependencies:
    
    sudo apt update sudo apt install build-essential sudo apt install python3.10-dev sudo apt install apt-transport-https curl gnupg

Build Crow HTTP server (this may take a few minutes for the first time):
   
    bazel build service/http_server:crow_service_main

Start the Crow HTTP server:
    
    bazel-bin/service/http_server/crow_service_main service/tools/config/interface/service.config service/http_server/server_config.config

Create virtual environment for the Python SDK:
    
    python3 -m venv venv –without-pip

Activate the virtual environment:
    
    source venv/bin/activate

Install pip in the virtual environment for the Python dependencies:
    
    curl https://bootstrap.pypa.io/get-pip.py | python

Install the Python dependencies:
    
    pip install -r requirements.txt

Start the GraphQL server:
    
    python3 app.py

### Setup Arrayan
Download NodeJS from [here](https://nodejs.org/en/download) and ensure that it’s added to PATH.

Clone the repo of arrayan to get started:
    
    git clone https://github.com/tarun1219/arrayan.git

Then navigate inside the ResVault directory:
    
    cd arrayan

Install the dependencies:
    
    npm install

Start the project:
    
    npm start

Build the project:
    
    npm run build

Setup cited from [ResVault](https://blog.resilientdb.com/2023/09/21/ResVault.html#prerequisites)
