const liveClassModel = require('../models/liveClassesModel');

module.exports.createLiveClass = async (meetLink) => {
    try {
        console.log("🔍 meetLink received in liveClassService:", meetLink); // ✅ Debugging log

        if (!meetLink) {
            throw new Error("❌ meetLink is undefined in liveClassService");
        }

        const liveClass = new liveClassModel({ meetLink });
        await liveClass.save();

        console.log("✅ Live Class saved successfully!");
        return liveClass;

    } catch (error) {
        console.error("❌ Error in liveClassService.createLiveClass:", error);
        throw error;
    }
};
