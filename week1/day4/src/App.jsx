import Dashboard
    from "./components/Dashboard";

import { DataProvider }
    from "./contexts/DataContext";

import "./App.css";


function App() {

    return (

        <DataProvider>

            <Dashboard />

        </DataProvider>

    );

}


export default App;