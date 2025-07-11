app.post('/updateScore', async (req, res) => {
    try {
        const { matchId, team1Score, team2Score } = req.body;
        const match = await Match.findById(matchId);
        if (!match) return res.status(404).json({ message: 'Match not found' });
        match.team1Score = team1Score;
        match.team2Score = team2Score;
        await match.save();
        res.status(200).json({ message: 'Match score updated successfully', match });
    } catch (error) {
        res.status(500).json({ message: 'Error updating score', error });
    }
});