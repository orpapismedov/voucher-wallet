# Voucher Wallet Application

## Overview
The Voucher Wallet application is a React-based web application that allows users to manage their vouchers efficiently. Users can add, edit, and archive vouchers, as well as manage voucher links and amounts. The application features a visually appealing design to enhance user experience.

## Features
- **Add Vouchers**: Users can input voucher links and amounts through a user-friendly form.
- **Edit Vouchers**: Users can modify existing vouchers to update their details.
- **Archive Vouchers**: Vouchers can be archived when their amounts reach zero, allowing for better organization.
- **Restore Vouchers**: Archived vouchers can be restored back to the main wallet with a new amount.
- **Responsive Design**: The application is designed to be visually appealing and responsive across different devices.

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm (version 5.6 or higher)

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd voucher-wallet-app
   ```
3. Install the dependencies:
   ```
   npm install
   ```

### Running the Application
To start the development server, run:
```
npm start
```
The application will be available at `http://localhost:3000`.

### Building for Production
To create a production build, run:
```
npm run build
```
This will generate an optimized build in the `build` directory.

## Folder Structure
- `public/`: Contains the main HTML file and static assets.
- `src/`: Contains the source code for the application.
  - `components/`: Contains React components for managing vouchers.
  - `styles/`: Contains CSS styles for the application.
  - `types/`: Contains TypeScript interfaces for type definitions.
  - `App.tsx`: Main application component.
  - `index.tsx`: Entry point for the React application.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.