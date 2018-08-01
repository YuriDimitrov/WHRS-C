/*global QUnit*/

sap.ui.define([
		'sap/ui/core/Component',
		'sap/ui/core/ComponentContainer',
		'sap/ui/core/util/LibraryInfo',
		'sap/ui/model/odata/ODataModel',
		'sap/m/App',
		'sap/m/Page',
		'jquery.sap.sjax'
	], function(Component, ComponentContainer, LibraryInfo, ODataModel, App, Page, sjax) {

	"use strict";

	// global QUnit, Flexie

	var oLog = jQuery.sap.log.getLogger("SampleTester");

	var SampleTester = function(sLibraryName, aExcludes) {
		this._sLibraryName = sLibraryName;
		this._aExcludes = aExcludes || [];
		this._iTimeout = 200;

		this._oApp = new App({
			initialPage: "page",
			pages: [
				this._oPage = new Page("page", {
					title: "Page under Test"
				})
			]
		});

		var oLibInfo = new LibraryInfo();
		oLibInfo._getDocuIndex(sLibraryName, function(oData) {

			// wait with test creation until all libs are loaded
			sap.ui.getCore().attachInit(function() {
				this._createTests(oData && oData.explored);
			}.bind(this));

		}.bind(this));

	};

	SampleTester.prototype.setTimeout = function(iTimeout) {
		this._iTimeout = iTimeout;
		return this;
	};

	SampleTester.prototype.placeAt = function(sId) {
		this._oApp.placeAt(sId);
		return this;
	};

	SampleTester.prototype._createTests = function(oExploredIndex) {

		var iTimeout = this._iTimeout;
		var oApp = this._oApp;
		var oPage = this._oPage;
		var sLibraryName = this._sLibraryName;

		oLog.info("starting to define tests for the samples of '" + this._sLibraryName + "'");

		QUnit.module(this._sLibraryName, {
			afterEach : function(assert) {
				if (window.Flexie) {
					oLog.info("destroy flexie instances");
					window.Flexie.destroyInstance();
				}
				// empty the page after each test, even in case of failures
				oPage.setTitle("---");
				oPage.destroyContent();
			}
		});

		function shorten(id) {
			return id.replace(sLibraryName + ".", "");
		}

		function makeTest(sampleConfig) {

			QUnit.test(sampleConfig.name + " (" + shorten(sampleConfig.id) + ")", function(assert) {

				// clear metadata cache
				ODataModel.mServiceData = {};

				// display the sample name
				oPage.setTitle(sampleConfig.name);

				var oComponent = sap.ui.component({
					name: sampleConfig.id
				});

				// load and create content
				oPage.addContent(
					new ComponentContainer({
						component: oComponent
					})
				);

				// wait for the rendering
				var done = assert.async();
				setTimeout(function() {
					assert.ok(true, sampleConfig.description || "sample " + sampleConfig.name);
					done();
				}, iTimeout);

				var oConfig = oComponent.getMetadata().getConfig();
				if ( oConfig && oConfig.sample && oConfig.sample.files ) {
					for (var i = 0; i < oConfig.sample.files.length; i++) {
						var sFile = oConfig.sample.files[i];
						var sUrl = jQuery.sap.getModulePath(sampleConfig.id, '/' + oConfig.sample.files[i]);
						assert.ok(jQuery.sap.syncHead(sUrl), "listed source file '" + sFile + "' should be downloadable");
					}
				}
			});

		}

		// register sample resources
		if (Array.isArray(oExploredIndex.samplesRef)) {
			// register an array of namespaces
			oExploredIndex.samplesRef.forEach(function (oItem) {
				jQuery.sap.registerModulePath(oItem.namespace, "" + oItem.ref);
			});
		} else if (oExploredIndex && oExploredIndex.samplesRef) {
			// register a single namespace
			jQuery.sap.registerModulePath(oExploredIndex.samplesRef.namespace, "" + oExploredIndex.samplesRef.ref);
		}

		// add step based samples (tutorials and others, comment this out if the run-time is getting too long)
		oExploredIndex.entities.forEach(function (oEnt) {
			var fnPrependZero,
				oStep,
				i = 0;

			if (oEnt.samplesAsSteps) {
				// helper function to add a leading 0 for all samples (folders will start with 01)
				fnPrependZero = function (iNumber) {
					if (iNumber.toString().length === 1) {
						return "0" + iNumber;
					}
					return iNumber;
				};

				for (; i < oEnt.samplesAsSteps.length; i++) {
					oStep = {
						"id": oEnt.id + "." + fnPrependZero(i + 1),
						"name": oEnt.name + " - Step " + (i + 1) + " - " + oEnt.samplesAsSteps[i]
					};
					oExploredIndex.samples.push(oStep);
				}
			}
		});

		var aSamples = oExploredIndex && oExploredIndex.samples;

		var nTests;
		if (aSamples) {
			nTests = 0;
			for (var i = 0; i < aSamples.length; i++ ) {
				if ( this._aExcludes.indexOf(aSamples[i].id) < 0 ) {
					oLog.info("adding test for sample '" + aSamples[i].name + "'");
					makeTest(aSamples[i]);
					nTests++;
				} else {
					oLog.info("ignoring sample '" + aSamples[i].name + "'");
				}
			}

		}

		if (nTests === 0) {
			oLog.info("no samples found, adding dummy test");
			QUnit.test("Dummy", function(assert) {
				assert.ok(true);
			});
		}

		// hide content area after all tests
		QUnit.done(function() {
			var oUIArea = oApp.getUIArea();
			if (oUIArea) {
				jQuery.sap.byId(oUIArea.getId()).hide();
			}
		});

		// now QUnit can start processing the tests
		oLog.info("start tests");
		QUnit.start();

	};

	return SampleTester;

});
