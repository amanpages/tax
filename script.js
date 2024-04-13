document.addEventListener("DOMContentLoaded", function () {
  function showCustomTooltip(element, message) {
    var tooltipText = element
      .next(".custom-tooltip")
      .find(".custom-tooltip-text");
    tooltipText.text(message);
    element.addClass("is-invalid");
    element.focus();
  }

  // Function to hide custom tooltip for a specific input field
  function hideCustomTooltip(element) {
    var tooltipContainer = element.next(".custom-tooltip");
    tooltipContainer.find(".custom-tooltip-text").text("");
    element.removeClass("is-invalid");
  }

  // Function to calculate tax
  function calculateTax(grossIncome, extraIncome, totalDeduction, ageGroup) {
    var overallIncome =
      parseFloat(grossIncome) +
      parseFloat(extraIncome) -
      parseFloat(totalDeduction);

    if (overallIncome <= 8) {
      return 0; // No tax
    } else {
      var taxRate = 0;
      if (ageGroup === "lt") {
        taxRate = 0.3; // 30% tax for age < 40
      } else if (ageGroup === "ge40") {
        taxRate = 0.4; // 40% tax for age ≥ 40 but < 60
      } else if (ageGroup === "ge60") {
        taxRate = 0.1; // 10% tax for age ≥ 60
      }

      var taxableIncome = overallIncome - 8; // Amount over 8 Lakhs
      var taxAmount = taxRate * taxableIncome;
      return taxAmount;
    }
  }

  // Function to handle input change and hide tooltip if value is valid
  $(".form-control").on("input", function () {
    var input = $(this);
    if (!isNaN(input.val()) && input.val() !== "") {
      hideCustomTooltip(input);
    }
  });

  // Form submission handling
  $("#submitButton").click(function (event) {
    event.preventDefault();

    // Check Gross Income
    var grossIncome = $("#grossIncome").val();
    if (isNaN(grossIncome) || grossIncome === "") {
      showCustomTooltip($("#grossIncome"), "Please enter a valid number only");
      return; // Stop execution if there's an error
    } else {
      hideCustomTooltip($("#grossIncome"));
    }

    // Check Extra Income
    var extraIncome = $("#extraIncome").val();
    if (isNaN(extraIncome) || extraIncome === "") {
      showCustomTooltip($("#extraIncome"), "Please enter a valid number only");
      return;
    } else {
      hideCustomTooltip($("#extraIncome"));
    }

    // Check Age Group
    var ageGroup = $("#ageSelect").val();
    if (!ageGroup) {
      showCustomTooltip($("#ageSelect"), "Please select an age group");
      return;
    } else {
      hideCustomTooltip($("#ageSelect"));
    }

    // Check Total Deduction
    var totalDeduction = $("#totalDeduction").val();
    if (isNaN(totalDeduction) || totalDeduction === "") {
      showCustomTooltip(
        $("#totalDeduction"),
        "Please enter a valid number only"
      );
      return;
    } else {
      hideCustomTooltip($("#totalDeduction"));
    }

    // Calculate tax
    var taxAmount = calculateTax(
      grossIncome,
      extraIncome,
      totalDeduction,
      ageGroup
    );
    $("#taxResult").html(`
    <div class="tax-info">
        <div class="info-label">Your Overall Income will be</div>
        <div class="tax-amount">${taxAmount.toFixed(2)} Lakhs</div>
        <div class="info-label">after Tax deduction</div>
    </div>
`);

    $("#taxResultPopup").fadeIn();
  });

  // Close result popup and reset form
  $("#closeResultPopup").click(function () {
    $("#taxResultPopup").fadeOut();
    $("#taxForm")[0].reset();
  });
});
