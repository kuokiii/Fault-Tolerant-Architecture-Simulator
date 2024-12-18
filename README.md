Fault-Tolerant Architecture Simulator

Overview

The Fault-Tolerant Architecture Simulator is an interactive web application designed to demonstrate and educate users about various fault-tolerant techniques used in computer architecture. This project simulates Error-Correcting Codes (ECC), Triple Modular Redundancy (TMR), and Fault Injection, providing a hands-on experience for understanding these critical concepts in reliable computing systems.

Features

1. ECC Simulation

1. Demonstrates Hamming Code, Reed-Solomon Code, and Convolutional Code
2. Adjustable error probability and burst error length
3. Visual representation of encoding, transmission, and decoding processes



2. TMR Simulation

1. Implements various voting strategies: Majority, Weighted, Adaptive, and Threshold
2. Adjustable fault probability and module reliabilities
3. Real-time visualization of module outputs and voting results



3. Fault Injection

1. Simulates different types of faults: Bit Flip, Stuck-at-0, Stuck-at-1, Random, Burst, and Intermittent
2. Customizable fault probability, burst length, and intermittent period
3. Visual representation of fault locations in binary data



4. Performance Analysis

1. Comparative analysis of different fault-tolerant techniques
2. Multiple chart types: Line, Bar, Radar, and Scatter plots
3. Time series data to show performance trends



5. Responsive Design

1. Mobile-friendly interface
2. Smooth animations and transitions for enhanced user experience





Technologies Used

- React.js
- Next.js
- TypeScript
- Tailwind CSS
- Framer Motion
- Recharts
- shadcn/ui components


Installation

1. Clone the repository:
git clone [https://github.com/your-username/fault-tolerant-simulator.git](https://github.com/your-username/fault-tolerant-simulator.git)
2. Navigate to the project directory:
cd fault-tolerant-simulator
3. Install dependencies:
npm install
4. Run the development server:
npm run dev
5. Open your browser and visit [http://localhost:3000](http://localhost:3000)


Usage

1. Home Page: Navigate through different simulations using the buttons in the header.
2. ECC Simulation:

1. Select the ECC type (Hamming, Reed-Solomon, or Convolutional)
2. Enter a binary input string
3. Adjust the error probability and burst error length
4. Click "Simulate ECC" to see the encoding, transmission, and decoding process



3. TMR Simulation:

1. Choose a voting strategy
2. Enter a binary input string
3. Set the fault probability
4. For threshold voting, adjust the threshold value
5. Click "Simulate TMR" to view the module outputs and final result



4. Fault Injection:

1. Select the fault type
2. Enter a binary input string
3. Adjust the fault probability
4. For burst faults, set the burst length
5. For intermittent faults, set the intermittent period
6. Click "Inject Fault" to see the fault injection results



5. Performance Analysis:

1. View various charts comparing different fault-tolerant techniques
2. Click on legend items to highlight specific metrics
3. Use the "Simulate New Data" button to generate new random data





Contributing

Contributions to the Fault-Tolerant Architecture Simulator are welcome! Please follow these steps to contribute:

1. Fork the repository
2. Create a new branch: git checkout -b feature-branch-name
3. Make your changes and commit them: git commit -m 'Add some feature'
4. Push to the branch: git push origin feature-branch-name
5. Submit a pull request


License

This project is licensed under the GNU License. See the LICENSE file for details.

Contact

For any questions or feedback, please contact:

Nirupam Thapa (kuoki)

- GitHub: @kuokiii
- Instagram: @_kuoki

