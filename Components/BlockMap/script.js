import $ from 'jquery'
import * as am4core from '@amcharts/amcharts4/core'
import * as am4maps from '@amcharts/amcharts4/maps'
import am4geodataWorldLow from '@amcharts/amcharts4-geodata/worldLow'
import { Fancybox } from '@fancyapps/ui'
import '@fancyapps/ui/dist/fancybox.css'

class BlockMap extends window.HTMLDivElement {
  constructor (...args) {
    const self = super(...args)
    self.init()
    return self
  }

  init () {
    this.$ = $(this)
    this.props = this.getInitialProps()
    this.resolveElements()
  }

  getInitialProps () {
    let data = {}
    try {
      data = JSON.parse($('script[type="application/json"]', this).text())
    } catch (e) {}
    return data
  }

  resolveElements () {
    this.$map = $('[data-map]', this)
  }

  connectedCallback () {
    this.initMap()
  }

  initMap () {
    const { options, items } = this.props
    const parseItems = items.map((item) => {
      return {
        ...item,
        lon: Number(item.lon),
        lat: Number(item.lat)
      }
    })
    this.$map = am4core.create(this.$map.get(0), am4maps.MapChart)
    this.$map.geodata = am4geodataWorldLow

    this.$map.homeZoomLevel = 2

    this.$map.homeGeoPoint = {
      latitude: 10.5007313,
      longitude: -19.0078481
    }

    this.$map.chartContainer.wheelable = false

    this.$map.projection = new am4maps.projections.Miller()

    const tooltip = new am4core.Tooltip()
    tooltip.background.filters.clear()
    tooltip.background.cornerRadius = 3
    tooltip.getFillFromObject = false
    tooltip.background.fill = am4core.color('#fff')
    tooltip.background.strokeWidth = 0
    tooltip.label.fill = am4core.color('#333')
    tooltip.label.padding(12, 12, 12, 12)
    tooltip.label.fontSize = 14
    tooltip.label.fontWeight = '700'
    // Create map polygon series
    const polygonSeries = this.$map.series.push(new am4maps.MapPolygonSeries())

    // Make map load polygon (like country names) data from GeoJSON
    polygonSeries.useGeodata = true

    const PolygonTemplate = polygonSeries.mapPolygons.template
    PolygonTemplate.fill = am4core.color('#f2f2f2')
    PolygonTemplate.stroke = am4core.color('#ccc')
    PolygonTemplate.cursorOverStyle = am4core.MouseCursorStyle.pointer

    PolygonTemplate.events.on('hit', function (ev) {
      ev.target.series.chart.zoomToMapObject(ev.target)
    })

    const PolygonTemplateHover = PolygonTemplate.states.create('hover')
    PolygonTemplateHover.properties.fill = am4core.color('#e6e6e6')
    PolygonTemplate.tooltipText = '{name}'
    PolygonTemplate.tooltip = tooltip

    this.$map.zoomControl = new am4maps.ZoomControl()

    const imageSeries = this.$map.series.push(new am4maps.MapImageSeries())
    imageSeries.data = parseItems

    const imageSeriesTemplate = imageSeries.mapImages.template
    imageSeriesTemplate.propertyFields.latitude = 'lat'
    imageSeriesTemplate.propertyFields.longitude = 'lon'

    const circle = imageSeriesTemplate.createChild(am4core.Circle)
    circle.nonScaling = true
    circle.radius = 8
    circle.stroke = '#fff'
    circle.strokeWidth = 3
    circle.fill = options.bullet
    circle.cloneTooltip = false
    circle.tooltipText = '{title}'
    circle.tooltipHTML = '<span data-no-translation>{title}</span>'
    circle.tooltip = tooltip
    circle.propertyFields.title = 'title'
    circle.propertyFields.address = 'contentHtml'
    circle.cursorOverStyle = am4core.MouseCursorStyle.pointer

    circle.events.on('hit', function (ev) {
      const officeTitle = ev.target.title
      const officeAddress = ev.target.address

      openofficeModal(officeTitle, officeAddress)
    })

    // office Modal
    function openofficeModal (officeTitle, officeAddress) {
      Fancybox.show([
        {
          src: `<h2>${officeTitle}</h2>${officeAddress}`,
          type: 'html',
          touch: false,
          autoFocus: false,
          backFocus: false
        }
      ])
    }
  }
}

window.customElements.define('flynt-block-map', BlockMap, {
  extends: 'div'
})
