const noble = require('noble-winrt');

console.log('Starting noble...');

// Initialize noble
noble.on('stateChange', (state) => {
    console.log('Bluetooth state:', state);

    if (state === 'poweredOn') {
        // Start scanning for BLE devices
        noble.startScanning([], true, (error) => {
            if (error) {
                console.error('Error starting scanning:', error);
            } else {
                console.log('Scanning for BLE devices...');
            }
        });
    } else {
        // Stop scanning if Bluetooth is not powered on
        noble.stopScanning();
        console.log('Bluetooth not powered on. Stopped scanning.');
    }
});

// Handle discovered BLE devices
noble.on('discover', (peripheral) => {
    console.log('Discovered BLE device:', peripheral.advertisement.localName, 'with UUID:', peripheral.uuid);
    console.log('RSSI:', peripheral.rssi);
    console.log('Advertisement Data:', peripheral.advertisement);
});
