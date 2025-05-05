import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";

// Fix for default marker icons in Leaflet with webpack
// @ts-ignore - This is a known issue with Leaflet and webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const gardenIcon = new L.Icon({
    iconUrl: "https://leafletjs.com/examples/custom-icons/leaf-green.png",
    iconSize: [32, 50],
    iconAnchor: [16, 50],
    popupAnchor: [0, -50],
});

const selectedGardenIcon = new L.Icon({
    iconUrl: "https://leafletjs.com/examples/custom-icons/leaf-red.png",
    iconSize: [38, 55],
    iconAnchor: [19, 55],
    popupAnchor: [0, -55],
});

interface Garden {
    _id: string;
    name: string;
    latitude: number;
    longitude: number;
}

interface MapProps {
    gardens: Garden[];
    onGardenSelect?: (garden: Garden) => void;
    selectedGarden: Garden | null;
}

const Map: React.FC<MapProps> = ({ gardens, onGardenSelect, selectedGarden }) => {
    // Find center position from gardens or default to Ho Chi Minh City
    const defaultCenter: [number, number] = [10.762622, 106.660172]; // Ho Chi Minh City
    const [center, setCenter] = useState<[number, number]>(defaultCenter);
    
    useEffect(() => {
        // If gardens are available, set center to the first garden location
        if (gardens && gardens.length > 0) {
            setCenter([gardens[0].latitude, gardens[0].longitude]);
        }
    }, [gardens]);

    // If there's a selected garden, center on it
    useEffect(() => {
        if (selectedGarden) {
            setCenter([selectedGarden.latitude, selectedGarden.longitude]);
        }
    }, [selectedGarden]);

    const handleMarkerClick = (garden: Garden) => {
        if (onGardenSelect) {
            onGardenSelect(garden);
        }
    };

    return (
        <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%", borderRadius: "10px" }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {gardens.map((garden) => (
                <Marker 
                    key={garden._id} 
                    position={[garden.latitude, garden.longitude]} 
                    icon={selectedGarden && selectedGarden._id === garden._id ? selectedGardenIcon : gardenIcon}
                    eventHandlers={{
                        click: () => handleMarkerClick(garden)
                    }}
                >
                    <Popup>
                        <div>
                            <h3 className="font-bold text-lg">{garden.name}</h3>
                            <p className="text-sm"><strong>Vĩ độ:</strong> {garden.latitude}</p>
                            <p className="text-sm"><strong>Kinh độ:</strong> {garden.longitude}</p>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default Map;