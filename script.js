$(function () {
    var storage, scores;
    var values = [1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 66, 78];

    var calculateTotal = function () {
        var red = $(".red .number").prev("input:checked").length;
        var yellow = $(".yellow .number").prev("input:checked").length;
        var green = $(".green .number").prev("input:checked").length;
        var blue = $(".blue .number").prev("input:checked").length;
        var strikes = $(".strikes").find("input:checked").length;

        if ($("#red-lock").prop("checked")) {red += 1};
        if ($("#yellow-lock").prop("checked")) yellow += 1;
        if ($("#green-lock").prop("checked")) green += 1;
        if ($("#blue-lock").prop("checked")) blue += 1;

        red = red > 0 ? values[red - 1] : 0;
        yellow = yellow > 0 ? values[yellow - 1] : 0;
        green = green > 0 ? values[green - 1] : 0;
        blue = blue > 0 ? values[blue - 1] : 0;

        $(".total h2").text(red + yellow + green + blue + strikes * -5);
    };

    var loadScores = function () {
        storage = window.localStorage;
        scores = JSON.parse(storage.getItem("quixx-online"));
        if (scores) {
            for (var key in scores) {
                $("input#" + key).prop("checked", scores[key]);
            }

            calculateTotal();
        } else {
            scores = {};
        }
    };

    var onChange = function (event) {
        var checkbox = event.currentTarget;
        // Only allow last number to be selected if there are at least five numbers filled in
        if ($(checkbox).next().hasClass("last-number")) {
            if (
                checkbox.checked &&
                $(checkbox).nextAll("input:checked").length < 5
            ) {
                checkbox.checked = false;
                return false;
            }
        }

        // Only allow lock to be selected if the last number has been selected
        if ($(checkbox).next().hasClass("lock")) {
            if (
                checkbox.checked &&
                $(checkbox).next().next().prop("checked") == false
            ) {
                checkbox.checked = false;
                return false;
            }
        }

        scores[checkbox.id] = checkbox.checked;
        storage.setItem("quixx-online", JSON.stringify(scores));
        calculateTotal();
    };

    var onScoreChange = function (event) {
        if (event) onChange(event);

        $('.board input[type="checkbox"]').prop("disabled", false);
        $('.board input[type="checkbox"]:checked')
            .nextAll("input")
            .prop("disabled", true);
    };

    loadScores();
    onScoreChange();

    $(".board").on("change", 'input[type="checkbox"]', onScoreChange);
    $(".strikes").on("change", 'input[type="checkbox"]', onChange);
    $("button.new").on("click", function () {
        storage.clear();
        window.location.reload();
    });
});

function resize() {
    const vh = `${window.innerHeight * 0.01}px`;
    document.documentElement.style.setProperty("--vh", vh);
}

resize();
window.addEventListener("resize", resize);
