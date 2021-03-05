exports.headers =
{
    name: `BMI`,
    aliases: [`bmi`],
	desc: `Calculate body mass index!`,
	category: `utility`,
	usage: `/bmi <height> <weight>`
};

exports.run = (client, message, args) =>
{
    const height = args[0];
    const weight = args[1];

    if(parseFloat(height) != height || parseFloat(weight) != weight)
	{
		message.channel.send(`:scales: **Correct usage: ${exports.headers.usage}**\nWith height in centimeters (cm), weight in kilograms (kg). Decimal points allowed.\n*BMI (abbrev. **body mass index**) is a convenient rule of thumb used to broadly categorize a person as underweight, normal weight, overweight, or obese based on tissue mass (muscle, fat, and bone) and height*`);
		return;
    }

    let h = parseFloat(height) / 100;
	let w = parseFloat(weight);
	let bmi_value = w / (h * h);
	bmi_value = bmi_value.toFixed(2);
		
	let out = `:scales: **Your BMI is: ` + bmi_value + `**\nYour classification is: `;
	if(bmi_value < 18.50)
	{
		out += `**Underweight**.`;	
	} else if(bmi_value >= 18.50 && bmi_value < 25.00) {
		out += `**Normal**.`;
	} else if(bmi_value >= 25.00 && bmi_value < 30.00) {
		out += `**Overweight**`;
	} else if(bmi_value >= 30.00) {
		out += `**Obese**`;	
	}
	message.channel.send(out);
}