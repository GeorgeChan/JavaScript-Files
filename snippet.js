/**
 * A collection of JavaScript functions I've written over the time
 *
 * Copyright (c) 2011, Robert Eisele (robert@xarg.org)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 **/

function normalize_angle(n, is_rad) {

	var tau = 360;

	if (undefined !== is_rad) {
		tau = 2 * Math.PI;
	}
	return (tau + (n % tau)) % tau;
}

function angle_between(n, a, b) {

	n = (360 + (n % 360)) % 360;
	a = (360 + (a % 360)) % 360;
	b = (360 + (b % 360)) % 360;

	if (a < b)
	return a <= n && n <= b;
	return a <= n || n <= b;
}

function scatter_amount(amount, sub, mul) {

	/* Table from: http://aws.amazon.com/de/s3/pricing/
		scattered_price(100000,
			[ 1E3,	49E3,	45E4,	5E5,	4E6,	5E6 ],
			[ 0.14,	0.125,	0.11,	0.095,	0.08,	0.055 ]
		)
	 */
	for (var sum = 0, i = 0; amount > 0; amount-= sub[i++]) {

		sum+= mul[i] * (amount <= sub[i] ? amount : sub[i]);
	//	sum+= mul[i] * (amount - Math.max(0, amount - sub[i]));
	}
	return sum;
}

function chop_amount(n, arr) {

	if (1 !== arr[0]) {
		return false;
	}

	for (var ret = {}, num, i = arr.length; n && i--; ) {

		num = n / arr[i] | 0;
		if (num) {
			ret[arr[i]] = num;
			n-= num * arr[i];
		}
	}
	return ret;
}

function rate(Ra, Rb, winner) {

	// http://de.wikipedia.org/wiki/Elo-Zahl

	var Ea = 1 / (1 + Math.pow(10, (Rb - Ra) / 400)),
		Eb = 1 / (1 + Math.pow(10, (Ra - Rb) / 400));

	// Ra+= k * (Sa - Ea)

	if (2 == winner) {
		Ra+= 10 * (0.0 - Ea);
		Rb+= 10 * (1.0 - Eb);
	} else if (1 == winner) {
		Ra+= 10 * (1.0 - Ea);
		Rb+= 10 * (0.0 - Eb);
	} else {
		Ra+= 10 * (0.5 - Ea);
		Rb+= 10 * (0.5 - Eb);
	}
	return [Ra, Rb];
}

function gpp(x) {

	var f = 1,
	n = 1,
	nn;

	if (x <= 0) {
		return 1;
	}

	for (;; n++) {

		if ((nn = n * n) >= x) {
			break;
		}
		if (0 === (x % nn)) {
			f = n;
		}
	}
	return f;
}

function readable_byte(b) {

	var e = Math.log(b) / (10 * Math.LN2) | 0;

	return (Math.round(b / Math.pow(1024, e) * 100) / 100) + [
		'B',
		'KB',
		'MB',
		'GB',
		'TB',
		'PB'
	][e];
}

function smooth(data, alpha) {

	var res = data[0];

	for (var i = 0; i < data.length; i++) {
		res = res * (1 - alpha) + data[i] * alpha;
	}
	return res;
}

function trend(data, weight) {

	var current = data.pop(),
	      trend = smooth(data, 2 / 3),
		   hour = new Date().getHours();

	for (var sup = 0, sum = 0, i = 24; i--; ) {
		sup+= weight[i] * (i < hour);
		sum+= weight[i];
	}
	return current - sup / sum * trend + trend;
}

function bound(n, x, y) {

	if (y < x || n < x) {
		return x;
	}

	if (y < n) {
		return y;
	}
	return n;
}

function array_squares(n) {

	// Facebook Hacker Cup solution

	var x = Math.sqrt(n) | 0,
	    y = 0,
	    r = [];

	while (y <= x) {

		var sum = x * x + y * y;

		if (sum < n) {
			++y;
			continue;
		}

		if (sum > n) {
			--x;
			continue;
		}
		r.push([x--, y++]);
	}
	return r;
}

function getClientDate(off) {

	var now = new Date;

	now.setTime(now.getTime() + 6e4 * (now.getTimezoneOffset() - off));
	return now;
}

function parseFloatEx(x) {

	return parseFloat(x.replace(/[^\d,.]+/g, "").replace(",", "."));
}

function range_diff(a, b, n) {

	return (n - b) * (b < n) ^ (a - n) * (n < a);
}

function normalize_version(str, len) {

	return str.match(/[^._,]+/g).slice(0, len || 2).join(".");
}
