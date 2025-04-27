import pandas as pd
import folium
from folium.plugins import HeatMap

def plot_crime_heatmap(csv_path='./data/cleaned_crime_reports_no_datetime.csv', output_html='crime_heatmap.html'):

    try:
        # Load data
        df = pd.read_csv(csv_path)

        # Validate necessary columns
        if 'latitude' not in df.columns or 'longitude' not in df.columns:
            raise ValueError("CSV must contain 'latitude' and 'longitude' columns.")

        # Create a folium map centered around San Jose by default
        map_center = [37.3382, -121.8863]  # San Jose downtown coordinates
        crime_map = folium.Map(location=map_center, zoom_start=12, tiles='cartodb dark_matter')

        # Prepare data for heatmap
        heat_data = df[['latitude', 'longitude']].dropna().values.tolist()

        # Add heatmap layer
        HeatMap(heat_data, radius=12, blur=15, min_opacity=0.5).add_to(crime_map)

        # Save map
        crime_map.save(output_html)
        print(f"✅ Heatmap created successfully! Open '{output_html}' to view it.")
    
    except Exception as e:
        print(f"❌ Error generating heatmap: {e}")

if __name__ == "__main__":
    plot_crime_heatmap()
