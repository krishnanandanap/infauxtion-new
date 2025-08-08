// Game state
let gameState = {
    condition: '',
    chaosLevel: 0,
    decisionCount: 0,
    disasterScore: 0,
    history: [],
    currentScenarios: [],
    scenarioIndex: 0
};

// Dynamic scenario generator - this would ideally connect to an AI service
function generateHealthScenarios(condition) {
    // This is a sophisticated pattern generator that creates realistic scenarios
    // In a real implementation, this would call an AI API
    
    const scenarioTemplates = {
        general: [
            {
                level: 0,
                scenario: `You're experiencing ${condition}, but you figure it's probably nothing serious. You've got that important thing to do today, and this can wait, right?`,
                chaos: `You decide to completely ignore it and self-medicate with whatever you found in your medicine cabinet from 2019. Your symptoms are now writing their own dramatic screenplay.`,
                wisdom: `You actually take it seriously and do some research, maybe consult a healthcare provider. Revolutionary concept: addressing problems when they're still manageable!`,
                medicalFact: `Early intervention for most health conditions leads to better outcomes and prevents complications. Ignoring symptoms often allows conditions to worsen significantly.`
            },
            {
                level: 1,
                scenario: `Your ${condition} is getting worse, and now you're developing additional concerning symptoms. But you're convinced this is just part of the 'healing process.'`,
                chaos: `You double down on your home remedies and add some random advice from a Facebook group. Your condition is now hosting its own medical mystery dinner party.`,
                wisdom: `You finally seek professional medical advice and get properly diagnosed. They start appropriate treatment before things spiral completely out of control.`,
                medicalFact: `Most health conditions have predictable progression patterns. What starts as mild symptoms can escalate to serious complications without proper treatment.`
            },
            {
                level: 2,
                scenario: `You're now dealing with serious complications from untreated ${condition}. Your body is sending you very clear 'HELP ME' signals, but you're still convinced you can handle this alone.`,
                chaos: `You're now googling 'Is it normal for [symptom] to be [alarming color/size/frequency]?' at 3 AM. Your search history reads like a medical horror novel.`,
                wisdom: `You recognize this is beyond your expertise and get immediate medical attention. They manage to prevent the worst-case scenarios with prompt intervention.`,
                medicalFact: `Complications from untreated conditions often require more intensive, expensive, and potentially risky treatments than early intervention would have required.`
            },
            {
                level: 3,
                scenario: `You're in a medical emergency situation. The ${condition} has led to serious complications that require immediate professional intervention.`,
                chaos: `Your dedication to avoiding healthcare has resulted in a dramatic entrance to the emergency room. The medical staff are impressed by your commitment to poor decision-making.`,
                wisdom: `Thanks to seeking help earlier, you avoided this crisis entirely. You're managing your condition effectively with proper treatment and professional guidance.`,
                medicalFact: `Medical emergencies often result from preventable escalation of treatable conditions. Emergency care is typically more expensive and traumatic than preventive care.`
            }
        ]
    };

    // Customize scenarios based on specific conditions
    const customizedScenarios = scenarioTemplates.general.map(template => ({
        ...template,
        scenario: template.scenario.replace(/\$\{condition\}/g, condition)
    }));

    // Add condition-specific details
    return addConditionSpecifics(customizedScenarios, condition);
}

function addConditionSpecifics(scenarios, condition) {
    const conditionLower = condition.toLowerCase();
    
    // Add specific details based on common conditions
    if (conditionLower.includes('headache') || conditionLower.includes('migraine')) {
        scenarios[0].chaos = scenarios[0].chaos.replace('self-medicate with whatever you found', 'take random painkillers like candy and stare at bright screens');
        scenarios[0].medicalFact = 'Rebound headaches can occur from overusing pain medications. Migraines have specific triggers and treatments that differ from regular headaches.';
    } else if (conditionLower.includes('anxiety') || conditionLower.includes('panic')) {
        scenarios[0].chaos = scenarios[0].chaos.replace('self-medicate with whatever you found', 'try to calm down with caffeine and social media');
        scenarios[0].medicalFact = 'Anxiety disorders are highly treatable with therapy and/or medication. Avoidance and self-medication often worsen anxiety symptoms.';
    } else if (conditionLower.includes('back pain')) {
        scenarios[0].chaos = scenarios[0].chaos.replace('self-medicate with whatever you found', 'try to "walk it off" and lift heavy things to prove you\'re fine');
        scenarios[0].medicalFact = 'Most back pain resolves with proper rest and gentle movement. However, severe or persistent pain may indicate serious underlying issues.';
    } else if (conditionLower.includes('insomnia') || conditionLower.includes('sleep')) {
        scenarios[0].chaos = scenarios[0].chaos.replace('self-medicate with whatever you found', 'fix it with more caffeine and late-night screen time');
        scenarios[0].medicalFact = 'Sleep disorders affect physical and mental health significantly. Good sleep hygiene and addressing underlying causes are more effective than ignoring the problem.';
    }

    return scenarios;
}

// Game functions
function startGame() {
    document.getElementById('heroSection').classList.add('hidden');
    document.getElementById('conditionInput').classList.remove('hidden');
    document.getElementById('healthCondition').focus();
}

function handleInputKeypress(event) {
    if (event.key === 'Enter') {
        generateScenario();
    } else {
        // Enable generate button when user types
        const input = document.getElementById('healthCondition');
        const generateBtn = document.getElementById('generateBtn');
        generateBtn.disabled = input.value.trim().length < 3;
    }
}

function useCondition(condition) {
    document.getElementById('healthCondition').value = condition;
    document.getElementById('generateBtn').disabled = false;
    generateScenario();
}

function generateScenario() {
    const condition = document.getElementById('healthCondition').value.trim();
    if (!condition || condition.length < 3) {
        alert('Please enter a health condition (at least 3 characters)');
        return;
    }

    // Initialize game state
    gameState.condition = condition;
    gameState.chaosLevel = 0;
    gameState.decisionCount = 0;
    gameState.disasterScore = 0;
    gameState.scenarioIndex = 0;
    gameState.currentScenarios = generateHealthScenarios(condition);

    // Show loading
    document.getElementById('conditionInput').classList.add('hidden');
    document.getElementById('gameInterface').classList.remove('hidden');
    document.getElementById('loadingState').classList.remove('hidden');

    // Simulate AI generation time
    setTimeout(() => {
        document.getElementById('loadingState').classList.add('hidden');
        loadScenario();
    }, 2000);
}

function loadScenario() {
    const currentScenario = gameState.currentScenarios[gameState.scenarioIndex];
    
    // Update UI
    document.getElementById('scenarioText').innerHTML = currentScenario.scenario;
    document.getElementById('scenarioText').classList.remove('hidden');
    document.getElementById('actionButtons').classList.remove('hidden');
    document.getElementById('chaosIndicator').classList.remove('hidden');

    // Update status
    updateGameStatus();
    updateChaosIndicator();
}

function updateGameStatus() {
    document.getElementById('currentCondition').textContent = gameState.condition;
    document.getElementById('chaosLevel').textContent = `Level ${gameState.chaosLevel}`;
    document.getElementById('decisionCount').textContent = gameState.decisionCount;
    document.getElementById('disasterScore').textContent = gameState.disasterScore;

    // Update status colors
    const chaosElement = document.getElementById('chaosLevel');
    const conditionElement = document.getElementById('currentCondition');
    
    if (gameState.chaosLevel === 0) {
        chaosElement.className = 'status-value good';
        conditionElement.className = 'status-value good';
    } else if (gameState.chaosLevel === 1) {
        chaosElement.className = 'status-value warning';
        conditionElement.className = 'status-value warning';
    } else if (gameState.chaosLevel >= 2) {
        chaosElement.className = 'status-value critical';
        conditionElement.className = 'status-value critical';
    }
}

function updateChaosIndicator() {
    const indicator = document.getElementById('chaosIndicator');
    const levelNames = [
        'Blissfully Ignoring Reality',
        'Concerning Denial Phase', 
        'Spectacular Mismanagement',
        'Medical Emergency Territory',
        'Ultimate Chaos Achievement'
    ];
    const levelClasses = ['level-1', 'level-2', 'level-3', 'level-4', 'level-5'];
    
    indicator.className = `spiral-level ${levelClasses[Math.min(gameState.chaosLevel, 4)]}`;
    indicator.innerHTML = `<strong>Chaos Level ${gameState.chaosLevel}:</strong> ${levelNames[Math.min(gameState.chaosLevel, 4)]}`;
}

function makeChoice(choiceType) {
    const currentScenario = gameState.currentScenarios[gameState.scenarioIndex];
    
    // Show loading
    document.getElementById('loadingState').classList.remove('hidden');
    document.getElementById('actionButtons').classList.add('hidden');

    setTimeout(() => {
        document.getElementById('loadingState').classList.add('hidden');
        
        let consequence = '';
        let medicalFact = currentScenario.medicalFact;
        
        if (choiceType === 'chaos') {
            consequence = currentScenario.chaos;
            gameState.disasterScore += 15;
            gameState.chaosLevel = Math.min(gameState.chaosLevel + 1, 3);
        } else {
            consequence = currentScenario.wisdom;
            gameState.disasterScore = Math.max(gameState.disasterScore - 5, 0);
            // Wisdom choices might still progress but more slowly
            if (Math.random() > 0.4) {
                gameState.chaosLevel = Math.min(gameState.chaosLevel + 1, 3);
            }
        }
        
        gameState.decisionCount++;
        gameState.scenarioIndex = Math.min(gameState.scenarioIndex + 1, gameState.currentScenarios.length - 1);

        // Show consequence
        document.getElementById('consequenceContent').innerHTML = consequence;
        document.getElementById('consequenceBox').classList.add('show');
        
        // Show medical fact
        document.getElementById('medicalContent').innerHTML = medicalFact;
        document.getElementById('medicalFact').classList.add('show');
        
        // Add to history
        addToHistory(choiceType, consequence);
        
        // Update status
        updateGameStatus();
        updateChaosIndicator();
        
        // Continue or end game
        if (gameState.scenarioIndex < gameState.currentScenarios.length - 1) {
            setTimeout(() => {
                document.getElementById('consequenceBox').classList.remove('show');
                document.getElementById('medicalFact').classList.remove('show');
                loadScenario();
            }, 5000);
        } else {
            setTimeout(showGameOver, 3000);
        }
        
    }, 1500);
}

function addToHistory(choiceType, consequence) {
    const historyEntry = {
        level: gameState.chaosLevel,
        choice: choiceType,
        consequence: consequence.substring(0, 120) + '...',
        condition: gameState.condition,
        timestamp: new Date().toLocaleTimeString()
    };
    
    gameState.history.push(historyEntry);
    
    const historyContent = document.getElementById('historyContent');
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    
    const choiceEmoji = choiceType === 'chaos' ? '🔥' : '🧠';
    const choiceLabel = choiceType === 'chaos' ? 'CHAOS CHOICE' : 'WISE CHOICE';
    
    historyItem.innerHTML = `
        <div style="color: #ff416c; font-weight: bold; margin-bottom: 0.5rem;">
            ${choiceEmoji} ${choiceLabel} - Level ${historyEntry.level}
        </div>
        <div style="color: #ffeb3b; font-size: 0.9rem; margin-bottom: 0.5rem;">
            Condition: ${historyEntry.condition}
        </div>
        <div style="font-size: 0.9rem; margin-bottom: 0.5rem;">
            ${historyEntry.consequence}
        </div>
        <div style="color: #888; font-size: 0.8rem;">
            ${historyEntry.timestamp}
        </div>
    `;
    
    if (gameState.history.length === 1) {
        historyContent.innerHTML = '';
    }
    
    historyContent.insertBefore(historyItem, historyContent.firstChild);
}

function showGameOver() {
    let message = '';
    let emoji = '';
    
    if (gameState.disasterScore > 40) {
        emoji = '💀';
        message = `<strong>Maximum Chaos Unlocked!</strong><br>You've successfully turned "${gameState.condition}" into a full-blown medical disaster. Your commitment to terrible decisions is truly impressive. In real life, this would involve significantly more paperwork and medical bills.`;
    } else if (gameState.disasterScore < 15) {
        emoji = '🏆';
        message = `<strong>Wisdom Warrior!</strong><br>You actually made smart choices about "${gameState.condition}" and avoided most of the chaos. How refreshingly responsible! Your future self is probably sending you thank-you notes.`;
    } else {
        emoji = '🎭';
        message = `<strong>Chaos Survivor!</strong><br>You experienced a wild mix of disasters and wisdom while dealing with "${gameState.condition}". Like most people, you learned some lessons the hard way but avoided total catastrophe.`;
    }
    
    document.getElementById('consequenceContent').innerHTML = `
        <div style="text-align: center; font-size: 3rem; margin-bottom: 1rem;">${emoji}</div>
        ${message}
        <br><br>
        <div style="background: rgba(255, 255, 255, 0.1); padding: 1.5rem; border-radius: 10px; margin: 2rem 0;">
            <strong>Your Chaos Journey:</strong><br>
            • Condition: ${gameState.condition}<br>
            • Chaos Level Reached: ${gameState.chaosLevel}/3<br>
            • Bad Decisions Made: ${gameState.decisionCount}<br>
            • Final Disaster Score: ${gameState.disasterScore}
        </div>
        <div style="text-align: center; margin-top: 2rem;">
            <button class="start-btn" onclick="resetGame()">Create Another Health Disaster 🔄</button>
            <br><br>
            <button class="action-btn wisdom-btn" onclick="shareResults()" style="min-width: 250px;">
                📱 Share My Chaos Results
            </button>
        </div>
    `;
    
    document.getElementById('consequenceBox').classList.add('show');
    document.getElementById('actionButtons').classList.add('hidden');
    document.getElementById('medicalFact').classList.remove('show');
}

function shareResults() {
    const shareText = `I just spectacularly mismanaged "${gameState.condition}" on Infauxtion! 🎭 Chaos Level: ${gameState.chaosLevel}, Disaster Score: ${gameState.disasterScore}. Want to ruin your health in record time too?`;
    
    if (navigator.share) {
        navigator.share({
            title: 'My Infauxtion Chaos Results',
            text: shareText,
            url: window.location.href
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareText + ' ' + window.location.href).then(() => {
            alert('Results copied to clipboard! Share away! 📋');
        });
    }
}

function resetGame() {
    gameState = {
        condition: '',
        chaosLevel: 0,
        decisionCount: 0,
        disasterScore: 0,
        history: [],
        currentScenarios: [],
        scenarioIndex: 0
    };
    
    // Reset UI
    document.getElementById('heroSection').classList.remove('hidden');
    document.getElementById('conditionInput').classList.add('hidden');
    document.getElementById('gameInterface').classList.add('hidden');
    document.getElementById('scenarioText').classList.add('hidden');
    document.getElementById('actionButtons').classList.add('hidden');
    document.getElementById('chaosIndicator').classList.add('hidden');
    document.getElementById('consequenceBox').classList.remove('show');
    document.getElementById('medicalFact').classList.remove('show');
    document.getElementById('loadingState').classList.add('hidden');
    
    // Reset form
    document.getElementById('healthCondition').value = '';
    document.getElementById('generateBtn').disabled = true;
    
    // Reset history
    document.getElementById('historyContent').innerHTML = '<p style="color: #888; font-style: italic;">Start your chaos journey to build your disaster log...</p>';
    
    updateGameStatus();
}

function toggleHistory() {
    document.getElementById('historyPanel').classList.toggle('show');
}

function showAbout() {
    alert('INFAUXTION: The dynamic health chaos generator! 🎭\n\nEnter any health condition and we\'ll show you exactly how to make it spectacularly worse — then teach you the real science behind making smart choices.\n\nBecause the best way to learn about health is to laugh at the worst possible decisions you could make! 💀');
}

// Initialize event listeners when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    // Enable input validation
    document.getElementById('healthCondition').addEventListener('input', function() {
        const generateBtn = document.getElementById('generateBtn');
        generateBtn.disabled = this.value.trim().length < 3;
    });

    // Initialize game status
    updateGameStatus();
});