document.getElementById("assessment-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const data = {
    profile: {
      companyName: form.companyName.value,
      industry: form.industry.value,
      size: form.size.value,
      itBudget: form.itBudget.value
    },
    answers: {
      "Digital Strategy": form.q1.value,
      "Commercial Growth": form.q2.value,
      "Customer Experience": form.q3.value,
      "Business Process Optimization": form.q4.value,
      "Data & Insights": form.q5.value,
      "Innovation": form.q6.value,
      "Workforce Enablement": form.q7.value,
      "Tech Platforms": form.q8.value
    }
  };

  const response = await fetch("https://tek-assessment-backend-b6dtaef7dggwgze2.francecentral-01.azurewebsites.net/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const result = await response.json();
  localStorage.setItem("assessmentResult", JSON.stringify(result));
  window.location.href = "result.html";
});
