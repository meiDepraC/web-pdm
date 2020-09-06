import { model, Model, prop, modelAction, getRoot } from 'mobx-keystone'
import { Graph } from '@antv/g6'
@model("webpdm/TGraph")
export class TGraph extends Model({
    zoom: prop(0)
}){
     G6Graph :Graph
    //  @modelAction
     setG6Graph(graph: Graph) {
        // alert(this.$modelId)
         this.G6Graph = graph
        // alert(this.$modelId)
        //  window.yyy = getRoot(this)
        //  alert( 'yyy.graph.G6Graph' + yyy.graph.G6Graph)
     }

     @modelAction
     setZoom(zoom: number) {
        this.zoom = zoom
     }
     @modelAction
     minZoom(graph : Graph) {
        // const gwidth = graph.get('width')
        // const gheight = graph.get('height')
        // const point = graph.getCanvasByPoint(gwidth / 2, gheight / 2)
        const zoom = graph.getZoom()
        if (zoom > 0.2) {
            this.zoom = zoom - 0.2
        } else {
            this.zoom = zoom - 0.02
        }
     }

     @modelAction
     maxZoom(graph : Graph) {
        // const gwidth = graph.get('width')
        // const gheight = graph.get('height')
        // const point = graph.getCanvasByPoint(gwidth / 2, gheight / 2)
        const zoom = graph.getZoom()
        if (zoom > 0.2) {
            this.zoom = zoom + 0.2
        } else {
            this.zoom = zoom + 0.02
        }
     }
     @modelAction
     container(graph : Graph) {
         graph.fitView(0)
         this.zoom = graph.getZoom()
     }
}