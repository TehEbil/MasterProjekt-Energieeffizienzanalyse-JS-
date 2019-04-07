<a><img src="https://www.kuechen-atlas.de/img/content/tn/sl/f/5/0/b6b3f/energieeffizienzklassen.jpg" title="energie" alt="Energie"></a>

# MasterProjekt-Energieeffizienzanalyse-GUI

> Dieses Projekt beinhaltet hauptsächlich Themen zur Interpolation von Lastgängen. Zur Veranschaulichung von Daten und zum subjektivem Überprüfen von Ergebnissen ist es immer hilfreich, sich diese visuell anzeigen zu lassen. Daher gibt es zusätzlich zu den eigentlichen Algorithmen noch eine Webversion, in der die zur Verfügung gestellten Daten anschaubar sind. Außerdem kann ein Algorithmus in Echtzeit getestet werden. Auch ist der Prototyp des Profilgenerators hier vorhanden, da das Web die beste Distributionsmöglichkeit für einen solchen Use Case bildet. Für genauere Ergebnisse fehlen, wie Paper beschrieben, noch weitere Daten.

> GUI, Energie, Effizienz, Solaranlage, Rentabilität

<a href="https://github.com/HSNR-WPP-Energy-2018/Paper" target="_blank">**Zum Paper**</a>

---

## Table of Contents

- [Installation](#installation)
- [Features](#features)
- [Usage](#usage)
- [License](#license)

---

## Installation

### Getting Started

Für das Projekt wird lediglich <a href="https://nodejs.org/en/">nodejs</a> in einer version größer 8 benötigt und ein modernerer Browser (Chrome, Edge, Firefox, etc). Internet Explorer wird nicht unterstützt!

Dabei besteht dieses Projekt aus zwei Teilen: dem Generierungsteil, um Daten zu erstellen, und den Visualisierungsteil, um die Daten anzuzeigen.
Ersteres wird durch die generateDataNodeJS.js Datei erledigt, sie wird durch nodejs aufgerufen. Der zweite Teil kann ganz normal in einem Browser durch ein Doppelklick geöffnet werden, er ist also auch portabel, wenn man die benötigten data-files mit distributiert. Die index.html Datei bildet bis auf kleine Ausnahmen, nur die Sicht ab und lädt die benötigten Dateien. Die app.js Datei zum Beispiel wird ebenfalls inkludiert. In ihr befindet sich die Applikationslogik. Hier kann man Voreinstellungen ändern, wie z.B. den Strompreis, der mit 0.30€ angesetzt wurde.

### Clone

Um das Projekt zu clonen, einfach den folgenden Pfad dafür benutzen: `https://github.com/TehEbil/MasterProjekt-Energieeffizienzanalyse-JS-.git`

### Setup

> clone, update and install packages

```shell
$ git clone `https://github.com/TehEbil/MasterProjekt-Energieeffizienzanalyse-JS-.git`
$ npm install
```

Beim ersten Mal sollten die benötigten Daten erstellt werden, siehe `Usage` section

---

## Features
- Konvertierung von Exceltabellen
- Visualisierung von gegebenen Daten 
- Korrellationsmatrix
- Profilgenerator

## Usage

Generierung von Daten:

```shell
$ node generateDataNodeJS
```

Die Datei `generateDataNodeJS.js` liest die Daten aus der `data.json` wendet ihre Methoden auf die Daten an und speichert die Ergebnisse in seperate Dokumente im \data Ordner. Wenn data.json noch nicht vorhanden ist, so lässt sich diese erstellen, indem man die Datei `generateDataNodeJS.js` öffnet, das Flag CONVERT_DATA auf true setzt und erneut den obigen Befehl ausführt.

Für die Benutzung des Projekts einfach die index.html Datei öffnen (Doppel-Klick) oder die Datei über einen Browser aufrufen mit folgendem Pfad: file:///PATH/TO/GITHUB/MasterProjekt-Energieeffizienzanalyse-JS-/index.html

Im Tab `Graph` kann man sich die verschiedenen generierten Daten angucken, die Zeiträume begrenzen, den Bereich des Graphen eingrenzen oder die Sicht weiter roomen. Oben rechts, mit der Funktion testRandom / testFebruar wird ein Monat gelöscht und es wird durch die Korrelationsmatrix versucht, diesen neu zu interpolieren. Der Vorgang dauert knapp 5 Sekunden.

Der Tab `MonthRelation` zeigt an, wie ein Monat sich in Abhängigkeit zu einem anderen Monat verhält. Vergleichen wir Dezember mit August: Dort steht ein Wert von 1.89. Dieser Wert sagt aus, dass der September das 1.89-fache vom Januar verbraucht.

Der letzte Tab, `Calculator`, unterteilt sich in zwei Möglichkeiten. Bei der Option "Einfach" kann man eine ganz grobe Schätzung machen, wie hoch der Jahresverbrauch sein wird. Bei "Erweitert" kann man die Geräte näher definieren und so einen deutlich präziseren Wert ermitteln. Bei beiden Optionen sieht man anschließend unten, wie hoch der jährliche Verbrauch ist, wie hoch die Gesamtkosten sind und wie viel die monatlichen Kosten beantragen. Mit der Option "Visualisieren" wird das Ergebnis dann auch nochmal visuell in einem Graph dargestellt.

---

## License

[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://badges.mit-license.org)

- **[MIT license](http://opensource.org/licenses/mit-license.php)**
