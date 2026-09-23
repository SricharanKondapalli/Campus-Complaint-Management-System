package com.campus.campusresourcemanagement.repository;

import com.campus.campusresourcemanagement.entity.Complaint;
import com.campus.campusresourcemanagement.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {

    List<Complaint> findByUser(User user);
}