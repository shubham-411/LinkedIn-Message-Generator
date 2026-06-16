package com.example.linkedinai.service;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.linkedinai.model.request;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class GeminiService {

    @Autowired
    private ObjectMapper objectMapper = new ObjectMapper();

    @Value("${gemini.api.key}")
    private String apiKey;

    private final String GEMINI_URL =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=";

    public String generateMessages(request request) {

        RestTemplate restTemplate = new RestTemplate();

        String prompt = buildPrompt(request);

        String body = """
            {
              "contents":[
                {
                  "parts":[
                    {"text": "%s"}
                  ]
                }
              ]
            }
            """.formatted(prompt.replace("\"","\\\""));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> entity = new HttpEntity<>(body, headers);

        ResponseEntity<String> response = restTemplate.exchange(
                GEMINI_URL + apiKey,
                HttpMethod.POST,
                entity,
                String.class
        );

        try {

            JsonNode root = objectMapper.readTree(response.getBody());

            String message = root
                    .path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();

            return message;

        } catch (Exception e) {
            throw new RuntimeException("Failed to parse Gemini response", e);
        }
    }

    private String buildPrompt(request request) {

        return """
You are an expert career networking mentor who helps students write thoughtful and professional LinkedIn outreach messages.

Your task is to generate a short connection request message for LinkedIn.

Target Professional:
Name: %s
Role: %s

Profile Context:
%s

Student Goal:
The student is seeking: %s

Guidelines:
1. The message must be under 280 characters.
2. Mention a specific insight, achievement, or topic from the provided context.
3. Maintain a respectful and professional tone.
4. Avoid generic phrases like:
- 'Hope you're doing well'
- 'Dear Sir/Madam'
- 'Please give me a job'
5. Do not sound salesy, desperate, or robotic.
6. Focus on curiosity and learning.
7. End with a light, open-ended question.

Style Requirements:
- Friendly but professional
- Natural and human-like
- Concise and clear
- Suitable for a first LinkedIn connection request

Output:
Generate 3 different message variations:
1. Curious Learner
2. Career Advice Seeker
3. Opportunity Explorer

Return only the messages without explanation.
""".formatted(
                request.getTargetName(),
                request.getTargetRole(),
                request.getProfileContext(),
                request.getStudentGoal()
        );
    }
}