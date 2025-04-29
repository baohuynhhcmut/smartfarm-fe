import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const customIcon = new L.Icon({
    iconUrl: "https://leafletjs.com/examples/custom-icons/leaf-red.png",
    iconSize: [32, 50],
});

const Map: React.FC = () => {
    return (
        <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: "100%", width: "100%",borderRadius:"10px" }} >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[51.505, -0.09]} icon={customIcon}>
                <Popup>
                    A simple popup in Leaflet!
                </Popup>
            </Marker>
        </MapContainer>
    );
};

export default Map;