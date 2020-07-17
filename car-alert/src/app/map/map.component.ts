import { Component, OnInit, ViewContainerRef, ViewChild, ComponentFactoryResolver, ComponentRef } from '@angular/core';
import OlMap from 'ol/map';
import OlXYZ from 'ol/source/xyz';
import OlTileLayer from 'ol/layer/tile';
import OlVectorLayer from 'ol/layer/Vector';
import OlVector from 'ol/source/Vector';
import OlView from 'ol/view';
import OlFeature from 'ol/feature';
import OlOverlay from 'ol/Overlay';
import OlGeomPoint from 'ol/geom/point';
import {transform, transformExtent} from 'ol/proj';
import OlStyle from 'ol/style/Style';
import OlIcon from 'ol/style/Icon';
import OSM from 'ol/source/OSM';
import {toSize} from 'ol/size';
import { AlertService } from '../alert.service';
import { AlertInfoComponent } from '../alert-info/alert-info.component';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  @ViewChild('container', { read: ViewContainerRef }) viewContainerRef: ViewContainerRef;
  ref: ComponentRef<any>;
  createAlertX: number;
  createAlertY: number;
  createAlertType: string;
  map: OlMap;
  source: OlXYZ;
  layer: OlTileLayer;
  vectorLayer: OlVectorLayer;
  view: OlView;
  markerSource: OlVector;
  markerStyle: OlStyle;
  constructor(private alertService: AlertService, private componentFactoryResolver: ComponentFactoryResolver) { }

  addMarker(alert): void {
    console.log(alert, 'alert is')
    const lon = alert.y;
    const lat = alert.x;
    console.log('lon:', lon);
    console.log('lat:', lat);

    //let iconFeatures: OlFeature;

    let iconFeature: OlFeature;
    const obj = {
        geometry: new OlGeomPoint(transform([lon, lat], 'EPSG:4326',
        'EPSG:3857')),
        _id: alert._id,
        user_id: alert.user_id,
        type: alert.type,
        x: alert.x,
        y: alert.y,
        speed: '',
        price: '',
        info: '',
        expected_delay: '',
      };
    if (alert.type === 'camera') {
        obj.speed = alert.speed;
    } else if (alert.type === 'toll') {
      obj.price = alert.price;
    } else if (alert.type === 'jam') {
      obj.expected_delay = alert.expected_delay;
    } else if (alert.type === 'accident') {
      obj.info = alert.info;
    }
    iconFeature = new OlFeature(
      obj
    );
    this.markerSource.addFeature(iconFeature);
  }
  destroyAlertInfo() {
    if (this.ref) {
    this.ref.destroy();
    }
  }
  showAlertInfo(alert: any) {
    this.destroyAlertInfo();
    const factory = this.componentFactoryResolver.resolveComponentFactory(AlertInfoComponent);
    this.ref = this.viewContainerRef.createComponent(factory);
    this.ref.instance.alert = alert;
    this.ref.changeDetectorRef.detectChanges();
  }
  ngOnInit(): void {
    var container = document.getElementById('popup');
    var content = document.getElementById('popup-content');
    var closer = document.getElementById('popup-closer');
    var containerView = document.getElementById('popup-view');
    var contentView = document.getElementById('popup-content-view');
    var closerView = document.getElementById('popup-closer-view');

    this.markerStyle = function(feature, resolution) {
      let olIcon = {}
      if (feature.values_.type === 'camera') {
          olIcon = new OlIcon(({
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            opacity: 0.75,
            src: '/assets/camera.png',
            scale: 0.8,
          }));
      } else if (feature.values_.type === 'toll') {
          olIcon = new OlIcon(({
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            opacity: 0.75,
            src: '/assets/toll.png',
            scale: 0.8,
          }));
      } else if (feature.values_.type === 'accident') {
          olIcon = new OlIcon(({
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            opacity: 0.75,
            src: '/assets/accident.png',
            scale: 0.8,
          }));
      } else if (feature.values_.type === 'jam') {
          olIcon = new OlIcon(({
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            opacity: 0.75,
            src: '/assets/jam.png',
            scale: 0.8,
          }));
      }
      const iconStyle = new OlStyle({
          image: olIcon
        });
      return iconStyle;
    };
    /**
     * Create an overlay to anchor the popup to the map.
     */
    const overlay = new OlOverlay({
      element: container,
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    });
    const overlayView = new OlOverlay({
      element: containerView,
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    });
    this.source = new OSM();

    this.layer = new OlTileLayer({
      source: this.source
    });
    this.markerSource = new OlVector();
    this.vectorLayer = new OlVectorLayer({
      source: this.markerSource,
      style: this.markerStyle
    });

    this.view = new OlView({
      center: [37.41, 8.82],
      zoom: 3
    });

    let featureListener = (evt, feature) => {
      this.showAlertInfo(feature.values_);
      overlayView.setPosition(evt.coordinate);
    }

    this.map = new OlMap({
      target: 'map',
      layers: [this.layer, this.vectorLayer],
      view: this.view,
      overlays: [overlay, overlayView]
    });

    let myMap = this.map;
    let mapComponent = this;
    this.map.on('singleclick', event => {

      myMap.forEachFeatureAtPixel(event.pixel, (feature, layer) => {
          console.log(feature);
          featureListener(event, feature);
      });
    });

    this.map.on('dblclick', evt => {
      const lonlat = transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');
      mapComponent.createAlertX = lonlat[1];
      mapComponent.createAlertY = lonlat[0];
      console.log('selected point with coordinates ', mapComponent.createAlertX, mapComponent.createAlertY);
      overlay.setPosition(evt.coordinate);
    });

    this.alertService.findAll().subscribe(alerts => {
        console.log(alerts);
        alerts.forEach(alert => {
          this.addMarker(alert);
        });
        const extent = this.vectorLayer.getSource().getExtent();
        this.map.getView().fit(extent, this.map.getSize());
    }, err => {
        console.log(err);
    });
  }
  ngOnDestroy() {
    this.destroyAlertInfo();
  }
}
