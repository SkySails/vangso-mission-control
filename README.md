<p align="center">
    <img src="https://raw.githubusercontent.com/SkySails/vangso-mission-control/master/readme-logo.svg?sanitize=true"
        height="130" alt="Vängsö Mission Control">
</p>
<p align="center">
  <img src="https://github.com/SkySails/vangso-mission-control/actions/workflows/deploy.yml/badge.svg" alt="CI Status" >
</p>

Vängsö Mission Control (VMC) is a flight-tracker with focus on gliders. It uses CesiumJS to render gliders in 3D space, just like [flightradar24](https://www.flightradar24.com/).
The data needed to render the gliders at the correct position and altitude comes from [GliderTracker](https://glidertracker.de/) and is delivered in real-time with the help of [WebSockets](https://www.wikiwand.com/en/WebSocket#:~:text=WebSocket%20is%20a%20computer%20communications,WebSocket%20is%20distinct%20from%20HTTP.)

## Future/Planned improvements

- [ ] Add ability to focus on an aircraft by either selecting its identifier in a list or by selecting it directly
- [ ] Add telemetry data charts for the selected aircraft (altitude, speed, etc.)
- [ ] Add correct altitude measurements above the ground instead of above the ellipsoid main height
- [ ] Add smoothing for aircraft movements to create a more real-time feel
- [ ] Add 3D polylines in order to visualize the track of specific aircraft
- [ ] Clamp aircraft to the ground when certain minimum requirements are met

## Quickstart

> Make sure that you have a compatible npm version installed. Compatible versions are mentioned in the [requirements](#requirements)

In order to get up and running, first run the following commands

```bash
 $ npm install
 $ npm start
```

When done, you should be able to access the page at [localhost:3000](http://localhost:3000).

## Requirements

| Package | Version |
| ------- | ------- |
| npm     | v6.x.x  |

## FAQ

<details>
  <summary>When running <code>npm start</code>, I get an error telling me that a module named <code>chokidar</code> could not be found. Please help???</summary>

Install `npm` version 6 or below. To do this, please issue the following command:

```bash
 $ npm i -g npm@6.14.13
```

Starting the project should now work as expeccted. For a list of available `npm` versions, please see the [version history](https://www.npmjs.com/package/npm?activeTab=versions)

</details>
