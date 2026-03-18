# Model Comparison Test

This document will test different Ollama models via PAL to compare their responses.

## Test Query

**Query:** "Read and summarize the information about Kel from the Apotheosis of Kel article. Provide only facts explicitly stated in the file - do not speculate or invent details."

**Source File:** `C:\Users\exman\Documents\aecury-site\content\Apotheosis of Kel.md`

## Expected Response (Ground Truth)

Based on the actual article content:
- Kel was a merchant known to be fair and true in all his dealings
- He lived among corrupt people who used false weights and rigged scales
- He remained honest despite becoming impoverished while dishonest competitors grew wealthy
- The Pontiff Ascendi and Vox Platini Dei learned of his people consorting with demons
- They agreed to decimation (killing 1 in 10) if one honest person could be found
- Kel's scales and weights were perfectly balanced and true
- During decimation lots, Kel was selected to be cleansed
- Kel voluntarily stepped into the cleansing vessel and lit himself aflame
- Through self-sacrifice, he transformed into Kelemvor - skeletal figure with crystal bones and gleaming scales
- Related entities: Pontiff Ascendi, Vox Platini Dei, Amaunator (The Golden Sun)
- Article status: Private, work-in-progress draft myth

## Models to Test

1. **llama3.2** (baseline - previously hallucinated)
2. **llama3.1:8b** (8B parameters, function calling)
3. **qwen2.5:7b** (top reasoning in <8B class)
4. **qwen2.5:14b** (larger, better capability)
5. **gpt-oss:20b** (20B parameters)
6. **mistral-small:latest** (strong instruction following)
7. **deepseek-r1:7b** (advanced reasoning)

## Test Results

### Test 1: llama3.2
**Response Summary:**
- Kel was a fair and true merchant among corrupt people
- Claims both Pontiff and Vox initially wanted extermination (INCORRECT - Vox wanted temperance)
- Says Vox was outraged when discovering extermination plans (INCORRECT timeline)
- Self-sacrifice and transformation to Kelemvor described correctly
- Crystal scales and bone transformation mentioned

**Evaluation:**
- Accuracy: 6/10 - Several factual errors about the Pontiff/Vox dynamic
- Hallucination: Some - mischaracterizes the initial agreement
- Completeness: 7/10 - Covers main story but gets key details wrong
- Following Instructions: 6/10 - Added incorrect interpretations
- File Access: Yes, clearly read the file

### Test 2: llama3.1:8b
**Response Summary:**
- Lists only 6 basic facts with line number citations
- Kel was a merchant, honest, lived among dishonest people
- Became impoverished
- Found by Vox to be the only honest merchant
- Missing: self-sacrifice, transformation, Kelemvor, decimation process

**Evaluation:**
- Accuracy: 10/10 - Everything stated is correct
- Hallucination: 0/10 - No invented facts
- Completeness: 3/10 - Extremely minimal, missing most of the story
- Following Instructions: 10/10 - Perfect adherence to "facts only"
- File Access: Yes, includes line number references

### Test 3: qwen2.5:7b
**Response Summary:**
- Covers main narrative well
- Kel's honesty vs corrupt society
- Decimation agreement and testing process
- Self-sacrifice transformation
- Adds "deity of death" descriptor for Kelemvor (NOT in source)
- Adds "duty of honor" interpretation (slight speculation)

**Evaluation:**
- Accuracy: 8/10 - Mostly accurate with minor additions
- Hallucination: 2/10 - "Deity of death" not in source
- Completeness: 9/10 - Good coverage of the narrative
- Following Instructions: 7/10 - Added some interpretation
- File Access: Yes

### Test 4: qwen2.5:14b
*Downloading - to be tested*

### Test 5: gpt-oss:20b
*FAILED - Operation aborted twice, model may have issues*

### Test 6: mistral-small:latest
*FAILED - Model not found (not installed)*

### Test 7: deepseek-r1:7b
**Response Summary:**
- Comprehensive structured summary with bullet points
- All major story beats covered accurately
- Setting, honesty vs deception, examination by supernatural powers
- Discovery of Kel, tragic transformation, reaction from powers
- Well-organized with clear headings
- Minor note: "Instead of being killed" slightly mischaracterizes the cleansing process

**Evaluation:**
- Accuracy: 9/10 - Excellent accuracy with very minor phrasing issue
- Hallucination: 0/10 - No invented facts
- Completeness: 10/10 - Most comprehensive coverage
- Following Instructions: 9/10 - Excellent fact adherence
- File Access: Yes, clearly read and understood the file

## Evaluation Criteria

For each model response, evaluate:
1. **Accuracy**: Does it match the source material?
2. **Hallucination**: Does it invent facts not in the source?
3. **Completeness**: Does it miss important details?
4. **Following Instructions**: Does it stick to facts only, no speculation?
5. **File Access**: Did it actually read the file or guess?

## Winner

**Current Results (4/7 models tested):**

**Best Overall: deepseek-r1:7b**
- Highest combined score for accuracy, completeness, and instruction-following
- Comprehensive coverage with structured presentation
- Zero hallucinations
- Only minor phrasing issue

**Most Conservative: llama3.1:8b**
- Perfect accuracy on what it stated
- Zero hallucinations
- But too minimal - missed most of the story

**Worst Performer: llama3.2**
- Multiple factual errors about Pontiff/Vox dynamics
- Mischaracterized the initial agreement
- Timeline issues

**Ranking (tested models):**
1. **deepseek-r1:7b** - 9.5/10 overall
2. **qwen2.5:7b** - 8/10 overall
3. **llama3.1:8b** - 7/10 overall (accurate but incomplete)
4. **llama3.2** - 6/10 overall (readable but factually flawed)

**Pending:** qwen2.5:14b (downloading), gpt-oss:20b (technical issues), mistral-small (not installed)
