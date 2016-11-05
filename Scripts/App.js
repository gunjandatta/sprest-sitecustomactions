/// <reference path="../node_modules/gd-sprest/dist/sprest.d.ts" />
var GD;
(function (GD) {
    var SiteCustomActions = (function () {
        function SiteCustomActions() {
        }
        // Method to add the custom action
        SiteCustomActions.addCA = function () {
            // Get the site
            var customActions = (new $REST.Site())
                .UserCustomActions();
            // Parse the css files
            for (var _i = 0, _a = this._cssFiles; _i < _a.length; _i++) {
                var caInfo = _a[_i];
                var existsFl = false;
                // Parse the custom actions
                for (var _b = 0, _c = this._caList; _b < _c.length; _b++) {
                    var ca = _c[_b];
                    // Ensure this custom action exists
                    if (ca.Name == caInfo.Name) {
                        // Set the flag
                        existsFl = true;
                        break;
                    }
                }
                // See if we need to add this custom action
                if (existsFl) {
                    continue;
                }
                // Add the custom action
                customActions.add({
                    Description: caInfo.Description ? caInfo.Description : "",
                    Location: "ScriptLink",
                    Name: caInfo.Name,
                    Sequence: caInfo.Sequence ? caInfo.Sequence : 100,
                    ScriptBlock: "var link=document.createElement('link'); link.rel='stylesheet'; link.type='text/css'; link.href='" + window["_spPageContextInfo"].webAbsoluteUrl + "/" + caInfo.Url + "'; document.head.appendChild(link);"
                }).next();
            }
            // Parse the js files
            for (var _d = 0, _e = this._jsFiles; _d < _e.length; _d++) {
                var caInfo = _e[_d];
                var existsFl = false;
                // Parse the custom actions
                for (var _f = 0, _g = this._caList; _f < _g.length; _f++) {
                    var ca = _g[_f];
                    // Ensure this custom action exists
                    if (ca.Name == caInfo.Name) {
                        // Set the flag
                        existsFl = true;
                        break;
                    }
                }
                // See if we need to add this custom action
                if (existsFl) {
                    continue;
                }
                // Add the custom action
                customActions.add({
                    Description: caInfo.Description ? caInfo.Description : "",
                    Location: "ScriptLink",
                    Name: caInfo.Name,
                    Sequence: caInfo.Sequence ? caInfo.Sequence : 100,
                    ScriptBlock: "var script=document.createElement('script'); script.src='" + window["_spPageContextInfo"].webAbsoluteUrl + "/" + caInfo.Url + "'; document.head.appendChild(script);"
                }).next();
            }
            // Execute the request
            customActions.execute(function () {
                // Refresh the page
                document.location.reload();
            });
        };
        // Method to render the panel
        SiteCustomActions.init = function (elementId) {
            var _this = this;
            // Set the element id
            this._elementId = elementId ? elementId : this._elementId;
            // Get the site
            (new $REST.Site())
                .UserCustomActions()
                .execute(function (customActions) { _this.renderPanel(customActions); });
        };
        // Method to remove the custom action
        SiteCustomActions.removeCA = function () {
            // Get the site
            var customActions = (new $REST.Site())
                .UserCustomActions();
            // Parse the css files
            for (var _i = 0, _a = this._cssFiles; _i < _a.length; _i++) {
                var caInfo = _a[_i];
                // Parse the custom actions
                for (var _b = 0, _c = this._caList; _b < _c.length; _b++) {
                    var ca = _c[_b];
                    // Ensure this custom action exists
                    if (ca.Name == caInfo.Name) {
                        customActions
                            .getById(ca.Id)
                            .delete()
                            .next();
                        // Break from the loop
                        break;
                    }
                }
            }
            // Parse the js files
            for (var _d = 0, _e = this._jsFiles; _d < _e.length; _d++) {
                var caInfo = _e[_d];
                // Parse the custom actions
                for (var _f = 0, _g = this._caList; _f < _g.length; _f++) {
                    var ca = _g[_f];
                    // Ensure this custom action exists
                    if (ca.Name == caInfo.Name) {
                        customActions
                            .getById(ca.Id)
                            .delete()
                            .next();
                        // Break from the loop
                        break;
                    }
                }
            }
            // Execute the request
            customActions.execute(function () {
                // Refresh the page
                document.location.reload();
            });
        };
        // Method to render the button
        SiteCustomActions.renderButtons = function (disableFl) {
            var el = document.querySelector("#" + this._elementId);
            // Render the button
            el == null ? null : el.innerHTML = '<button type="button" onclick="{{Method}}">{{Text}}</button>'
                .replace(/{{Method}}/g, disableFl ? "return GD.SiteCustomActions.removeCA(this);" : "return GD.SiteCustomActions.addCA(this);")
                .replace(/{{Text}}/g, disableFl ? "Disable" : "Enable");
        };
        // Method to render the panel
        SiteCustomActions.renderPanel = function (customActions) {
            // Clear the global variables
            this._caList = [];
            // Parse the custom actions
            for (var _i = 0, _a = customActions.results; _i < _a.length; _i++) {
                var customAction = _a[_i];
                var isCSS = false;
                // Parse the css files
                for (var _b = 0, _c = this._cssFiles; _b < _c.length; _b++) {
                    var caInfo = _c[_b];
                    // See if this custom action exists
                    if (caInfo.Name == customAction.Name) {
                        // Save a reference to this custom action
                        this._caList.push(customAction);
                        break;
                    }
                }
                // See if the custom action was found
                if (isCSS) {
                    continue;
                }
                // Parse the js files
                for (var _d = 0, _e = this._jsFiles; _d < _e.length; _d++) {
                    var caInfo = _e[_d];
                    // See if this custom action exists
                    if (caInfo.Name == customAction.Name) {
                        // Save a reference to this custom action
                        this._caList.push(customAction);
                        break;
                    }
                }
            }
            // Render the buttons
            this.renderButtons(this._caList.length == this._cssFiles.length + this._jsFiles.length);
        };
        // List of css files
        SiteCustomActions._cssFiles = [
            { Name: "MyCustomBannerCSS", Url: "Content/banner.css", Sequence: 100, Description: "Styles the banner." }
        ];
        // List of js files
        SiteCustomActions._jsFiles = [
            { Name: "MyCustomBannerJS", Url: "Scripts/banner.js", Sequence: 200, Description: "Adds a custom banner to the top of the page." }
        ];
        return SiteCustomActions;
    }());
    GD.SiteCustomActions = SiteCustomActions;
})(GD || (GD = {}));
// Wait for the page to load
window.addEventListener("load", function () {
    // Render the panel
    GD.SiteCustomActions.init("main");
});
//# sourceMappingURL=App.js.map