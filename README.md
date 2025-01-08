# AstroPC

Library of core routines for practical astronomy.

- [AstroPC](#astropc)
  - [Features](#features)
  - [Requireents](#requireents)
  - [Getting started](#getting-started)
  - [Usage](#usage)
  - [Additional information](#additional-information)
    - [Civil vs. Astronomical year](#civil-vs-astronomical-year)
    - [Zero day](#zero-day)
    - [Gregorian calendar](#gregorian-calendar)
  - [Sources](#sources)
  - [How to contribute](#how-to-contribute)
  - [Footnotes](#footnotes)

## Features

- Converts between _Civil_ and _Julian_ dates.
- Calculates difference between _Universial Coordinated_ and _Terrestrial Dynamic_ time (_Delta-T_).
- Calculates _Sidereal_ (_Stellar_) time.
- Calculates _Nutation_ and _Obliquity of the ecliptic_.
- Transforming between various types of celestial coordinates.
- Miscallenous mathematical routines usefull for practical astronomy.
- Accurate positions of Sun, Moon and the planets, including _Pluto_.
- Time of solstices, equinoxes and lunations.

## Requireents

- **TypeScript** >= 5.7
- **NodeJS** >=2.12

## Getting started

Install the library as a dependency to your project

```console
$ npm install --save git+https://github.com/ilbagatto/astropc-ts
```

## Usage

See **tests/** for usage examples.

## Additional information

### Civil vs. Astronomical year

There is disagreement between astronomers and historians about how to count
the years preceding the year 1. Astronomers generally use zero-based system.
The year before the year +1, is the _year zero_, and the year preceding the
latter is the _year -1_. The year which the historians call _585 B.C._ is
actually the year _-584_.

### Zero day

Zero day is a special case of date: it indicates 12h UT of previous calendar
date. For instance, _1900 January 0.5_ is often used instead of
_1899 December 31.5_ to designate start of the astronomical epoch.

### Gregorian calendar

_Civil calendar_ in most cases means _proleptic Gregorian calendar_. it is
assumed that Gregorian calendar started at _Oct. 4, 1582_, when it was first
adopted in several European countries. Many other countries still used the
older Julian calendar. In Soviet Russia, for instance, Gregorian system was
accepted on **Jan 26, 1918**. See
[Wiki article](https://en.wikipedia.org/wiki/Gregorian_calendar#Adoption_of_the_Gregorian_Calendar).

## Sources

The formulae were adopted from the following sources:

- _Peter Duffett-Smith, "Astronomy With Your Personal Computer", Cambridge University Press, 1997_
- _Jean Meeus, "Astronomical Algorithms", 2d edition, Willmann-Bell, 1998_
- _J.L.Lawrence, "Celestial Calculations", The MIT Press, 2018_

## How to contribute

You may contribute to the project by many different ways, starting from refining and correcting its documentation,
especially if you are a native English speaker, and ending with improving the code base. Any kind of testing and
suggestions are welcome.

You may follow the standard Github procedures or, in case you are not comfortable with them, just send your suggestions
to the author by other means.

## Footnotes

[^1]:
    _Julian Period_ 7980 years of numbered days to be used in determining time elapsed between various historical events.
    It is the product of three calendar cycles: `28 (solar cycle) × 19 (lunar cycle) × 15 (indiction cycle) = 7980 years`
