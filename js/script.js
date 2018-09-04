const inputHexa = document.querySelector('input#setColor');
const selectText = document.querySelector('select#setTextColor');
const submitInfo = document.querySelector('button#setInfo');
const tableInfo = document.querySelector('table>tbody');
const pageContent = document.querySelector('.page-content');
const light = document.querySelector('#light');
const dark = document.querySelector('#dark');
let trained = [];

submitInfo.addEventListener('click', (e) => {
	if (inputHexa.value.length == 7) {
		const hex = inputHexa.value;
		let output = selectText.value == 'dark' ? { dark: 1 } : { light: 1 };
		trained[trained.length] = { input: getRgb(hex), output: output };
		addToTable(hex, selectText.value == 'dark' ? 'Escuro' : 'Claro');
		update(hex);
	}
});

function update(backgroundHex) {
	const rgb = getRgb(backgroundHex);
	const network = new brain.NeuralNetwork();
	network.train(trained);
	const result = brain.likely(rgb, network);
	const textColor = result === 'dark' ? 'black' : 'white';
	pageContent.style.color = textColor;

	let percent = network.run(rgb);
	let lightPercent = 0, darkPercent = 0;
	if (typeof percent.light != "undefined") {
		lightPercent = percent.light * 100;
	}
	if (typeof percent.dark != "undefined") {
		darkPercent = percent.dark * 100;
	}
	light.innerText = lightPercent.toFixed(2) + " %";
	dark.innerText = darkPercent.toFixed(2) + " %";
}

function addToTable(hex, info) {
	let line = document.createElement('tr');
	line.innerHTML = '<td style="background:' + hex + ';border:1px solid black;"></td><td>' + hex + '</td><td>' + info + '</td>';
	tableInfo.appendChild(line);
}

function getRgb(hex) {
	var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	hex = hex.replace(shorthandRegex, function (m, r, g, b) {
		return r + r + g + g + b + b;
	});

	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: Math.round(parseInt(result[1], 16) / 2.55) / 100,
		g: Math.round(parseInt(result[2], 16) / 2.55) / 100,
		b: Math.round(parseInt(result[3], 16) / 2.55) / 100,
	} : null;
}

let demoColorPicker = new iro.ColorPicker("#colorIro", { width: 200, height: 200, color: "#ffffff" });

demoColorPicker.on("color:change", function (color, changes) {
	const hex = color.hexString;
	document.body.style.background = hex;
	inputHexa.value = hex;
	if (trained.length > 0) {
		update(hex);
	}
});