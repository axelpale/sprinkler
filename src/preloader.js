
parameters:
- pool: a list of image urls
- number of images to keep in queue
- minimum number of images to download before continuing

storage
- pool: a list of all image urls
- queue: list of image urls to pop
- memory: list of downloaded images. A map from url to HTML Image objects.

pop an image
- synchronous
- removes image url from queue
- generate new images to the queue
- returns HTML Image object

download images
- a few images at the same time
- download until all images in the queue have finished downloading

extend pool
- controversy:
  - begin after first ones loaded vs add urls to be downloaded
  - multiple layered rains vs one preloader

yet another approach
- request download when image needs to be dropped. Drop when downloaded.
- Subject to ugly bursts.

Approach:
- Separate canvas animation code and particle timing.
- Simple drawing API: sprinkler.dropParticle(particle)
- A triangle:
  - api: setup view, start runner
  - view: canvas drawing and model ticker
  - runner: timing of particle creation. Image preload.

var Preloader = function (arrayOfUrls) {

}

Preloader.prototype.pop = function () {
  // Return Image
}
