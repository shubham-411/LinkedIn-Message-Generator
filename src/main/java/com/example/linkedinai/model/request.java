package com.example.linkedinai.model;

public class request {
    private String studentGoal;
    private String targetName;
    private String targetRole;
    private String profileContext;

    public void setStudentGoal(String studentGoal) {
        this.studentGoal = studentGoal;
    }

    public void setTargetName(String targetName) {
        this.targetName = targetName;
    }

    public void setTargetRole(String targetRole) {
        this.targetRole = targetRole;
    }

    public void setProfileContext(String profileContext) {
        this.profileContext = profileContext;
    }

    public String getStudentGoal() {
        return studentGoal;
    }

    public String getTargetName() {
        return targetName;
    }

    public String getTargetRole() {
        return targetRole;
    }

    public String getProfileContext() {
        return profileContext;
    }
}
