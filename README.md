# Mobile Resource Processing Scripts

This is a small collection of NodeJS scripts for processing images for Meteor Mobile App Development

## Installation and Usage

Clone this repository and install the dependencies

```
git clone https://github.com/RichardMarks/resource-processing.git
cd resource-processing
yarn install
```

These scripts depend on ImageMagick being available on your operating system.

Install ImageMagick https://imagemagick.org/ if you do not have it installed

homebrew on macOS

```
brew install imagemagick
```

Next, put a `source.png` image and `icon-source.png` image in the current directory.

```
cp path/to/my/source/image.png source.png
cp path/to/my/icon/source/image.png icon-source.png
```

Run the scripts

```
node generate-icons
node generate-launch-screens
```

## License
(c) 2020, Richard Marks
MIT License - See LICENSE.md
