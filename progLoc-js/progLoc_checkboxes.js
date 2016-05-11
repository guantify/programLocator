// create layer selector
function createSelector(layer) {
	var sql = new cartodb.SQL({
			user : 'codefornewark'
		});
	$('.checkbox').on('click', function () {
		var checkedValues = [];
		var query;
		var baseQuery = "SELECT * FROM table_2";

		// each checked type of location will be added to query
		$('.checkbox').each(function () {
			if (this.checked) {
				checkedValues.push(this.value);
			}

			// if none is checked then all will display
			if ($('.checkbox:checked').length == 0) {
				query = baseQuery;
			}

			// creating query for one checkbox
			else if ($('.checkbox:checked').length == 1) {
				query = baseQuery + " WHERE " + checkedValues[0] + " LIKE '%|%'";
			}

			// concatenating query for multiple checkboxes checked
			else if ($('.checkbox:checked').length > 1) {
				query = baseQuery + " WHERE " + checkedValues[0] + " LIKE '%|%'"
					for (var i = 1; i < $('.checkbox:checked').length; i++) {
						query += " OR " + checkedValues[i] + " LIKE '%|%'";
					}
			}

			// change the query in the layer to update the map
			layer.setSQL(query);
		});
	});

	// logic for Deselect All button
	$('.deselect').on('click', function () {
		$('.checkbox').each(function () {
			this.checked = false;
		});
		layer.setSQL("SELECT * FROM table_2");
	});
}

function main() {
	cartodb.createVis('map', 'https://codefornewark.cartodb.com/api/v2/viz/47ce16ca-0503-11e6-8a54-0e31c9be1b51/viz.json', {
		tiles_loader : true,
		center_lat : 40.735657,
		center_lon : -74.172367,
		zoom : 13,
		zoomControl : false,
	})
	.done(function (vis, layers) {
		// layer 0 is the base layer, layer 1 is cartodb layer
		var subLayer = layers[1].getSubLayer(0);
		createSelector(subLayer);

		// get current instance of map for use in recentering
		var map = vis.getNativeMap();

		// Recenter button logic
		$('#recenter_button').on('click', function () {
			map.setView([40.735657, -74.172367], 13);
		});

		// setting min and max zoom levels
		vis.map.set({
			minZoom : 12,
			maxZoom : 15
		})

	})
	.error(function (err) {
		console.log(err);
	});
}
$(function () {
	$('.main').slicknav({
		label : 'Newark Thrives!'
	});
});
window.onload = main;