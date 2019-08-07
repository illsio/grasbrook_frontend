import {Injectable} from "@angular/core";
import {CsLayer} from "../../typings";
import {ConfigurationService} from "./configuration.service";
import {TripsDeckGlLayer} from "../layers/trips.deck-gl.layer";
import {GamaDeckGlLayer} from "../layers/gama.deck-gl.layer";
import {map} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {AlertService} from "./alert.service";

@Injectable({
  providedIn: "root"
})
export class LayerLoaderService {

  public grid_data_url = `https://cityio.media.mit.edu/grasbrook/`;

  constructor(private http: HttpClient,
              private alertService: AlertService,
              private config: ConfigurationService) {
  }

  getLayers(): CsLayer[] {
    const layers: CsLayer[] = [];
    Array.prototype.push.apply(layers, this.config.layers);

    for (let layer of layers) {
      if (layer.id === "trips-deckgl") {
        let tripsDeck = TripsDeckGlLayer.createTripsLayer(layer.id);
        layers[layers.indexOf(layer)] = this.castCSLayer(tripsDeck, layer.id);
      } else if (layer.id === "gama-deckgl") {
        let gamaDeck = GamaDeckGlLayer.createTripsLayer(layer.id);
        layers[layers.indexOf(layer)] = this.castCSLayer(gamaDeck, layer.id);
      }
    }
    return layers;
  }

  castCSLayer(layer, displayName) {
    let csLayer: CsLayer = layer;
    csLayer.addOnMapInitialisation = true;
    csLayer.showInLayerList = true;
    csLayer.displayName = displayName;
    return csLayer;
  }

  /*
  *   Does this belong in this service / create a new service
  */

  sendGridData(gridData) {
    return this.http
      .post<any>(this.grid_data_url, {
        data: gridData
      })
      .pipe(
        map(response => {
          return response;
        })
      );
  }
}
